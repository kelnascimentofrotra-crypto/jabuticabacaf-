#!/usr/bin/env python3
"""Gera src/media.js com o registro de imagens e sons do Wikimedia Commons.

Os nomes de arquivo foram localizados em páginas reais do Wikimedia Commons.
O caminho de upload do Commons é derivado do MD5 do nome do arquivo
(esquema documentado do MediaWiki), então não há URL inventada: se o arquivo
existir no Commons, os endereços abaixo existem.

Uso: python3 tools/gen_media.py
"""
import hashlib
import json
import pathlib
import unicodedata
from urllib.parse import quote

ROOT = pathlib.Path(__file__).resolve().parent.parent

# chave: (arquivo no Commons, largura original conhecida ou None, autor, licença, descrição/alt)
IMAGES = {
    "apollo17": ("The_Earth_seen_from_Apollo_17.jpg", 3000, "NASA / tripulação da Apollo 17", "Domínio público",
                 "A Terra inteira fotografada pela tripulação da Apollo 17 em 7 de dezembro de 1972: África, Península Arábica e Antártida."),
    "amazon_aerial": ("Aerial_view_of_the_Amazon_Rainforest.jpg", 3450, "lubasi (Flickr)", "CC BY-SA 2.0",
                      "Vista aérea da Floresta Amazônica cortada pelo rio Solimões."),
    "amazon_ciat": ("Amazon_CIAT_(5).jpg", None, "Neil Palmer / CIAT", "ver página do arquivo",
                    "Floresta amazônica vista do alto, perto de Manaus (AM)."),
    "amazon_varzea": ("Vazea_Rio_Amazonas.jpg", 4320, "ver página do arquivo", "ver página do arquivo",
                      "Floresta de várzea às margens do rio Amazonas, perto de Manaus."),
    "amazon_rain": ("Chuva_na_floresta_amazonica_Manaus_Amazonas_Brasil.jpg", None, "ver página do arquivo", "ver página do arquivo",
                    "Chuva caindo sobre a floresta amazônica, em Manaus (AM)."),
    "mata_atlantica": ("Floresta_da_Mata_Atlântica.jpg", None, "Adriana Cezar", "CC BY-SA 4.0",
                       "Mata Atlântica em Macaé de Cima, Nova Friburgo (RJ)."),
    "amazon4": ("Amazon4.jpg", None, "CIAT (Flickr)", "ver página do arquivo",
                "Floresta amazônica preservada, vista de cima, perto de Manaus."),
    "taiga_ergaki": ("Ergaki,_Taiga_in_Siberia,_Dark_coniferous_forest,_Sayan_Mountains,_Russia.jpg", 6000,
                     "Vyacheslav Argenberg", "ver página do arquivo",
                     "Taiga escura de coníferas no Parque Ergaki, montes Sayan, Sibéria (Rússia)."),
    "taiga_baikal": ("Lake_Baikal,_Siberian_taiga_forest,_Siberia,_Russia.jpg", 4912, "Vyacheslav Argenberg", "ver página do arquivo",
                     "Taiga siberiana no outono, com lariços, pinheiros e bétulas, às margens do lago Baikal."),
    "boreal_finland": ("Boreal_forest_in_Finland.JPG", 3072, "EtäKärppä", "ver página do arquivo",
                       "Floresta boreal coberta de neve perto de Mietoinen, Finlândia."),
    "lapland": ("Winter_in_Lapland_(Unsplash).jpg", None, "Vincent Guth (Unsplash)", "CC0",
                "Floresta de coníferas coberta de neve na Lapônia, Finlândia."),
    "araucaria": ("Floresta_com_Araucária.JPG", None, "Ponevina", "ver página do arquivo",
                  "Floresta com araucárias no Parque Estadual de Tainhas (RS)."),
    "tundra_kola": ("Tundra_on_the_Kola_Peninsula,_Russia.jpg", None, "ver página do arquivo", "CC BY-SA 4.0",
                    "Tundra da Península de Kola, Rússia, em setembro."),
    "tundra_svalbard": ("Tundra_of_Svalbard,_densely_growing_moss.jpg", None, "ver página do arquivo", "CC BY-SA 4.0",
                        "Tundra de Svalbard no verão, coberta por musgos densos."),
    "tundra_barrow": ("Arctic_tundra_in_July.jpg", None, "Flickr", "CC BY 2.0",
                      "Tundra ártica em julho, perto de Barrow (Utqiaġvik), Alasca."),
    "lichen": ("Reindeer_Moss_(Cladonia_rangiferina)_-_geograph.org.uk_-_581150.jpg", None, "Evelyn Simak", "CC BY-SA 2.0",
               "Líquen-das-renas (Cladonia rangiferina), conhecido como musgo-de-rena."),
    "temp_spring": ("Fresh_green_beech_forest_20190526_P5261591.JPG", 4000, "あおもりくま (aomorikuma)", "ver página do arquivo",
                    "Faial com folhas novas na primavera e restos de neve, província de Aomori, Japão."),
    "temp_summer": ("Baumkronenpfad_-_Hainich_-_TreeTopWalk_above.JPG", 4320, "ver página do arquivo", "ver página do arquivo",
                    "Copas verdes de faias no verão, vistas da passarela do Parque Nacional Hainich, Alemanha."),
    "temp_autumn": ("Autumnal_deciduous_forest_-_Laubwand_im_Herbst.jpg", 4928, "Norbert Nagel", "ver página do arquivo",
                    "Floresta decídua no outono em Mörfelden-Walldorf, Hesse, Alemanha."),
    "temp_winter": ("4821_Forests_in_Winter.jpg", None, "ver página do arquivo", "ver página do arquivo",
                    "Florestas no inverno na Alta Suábia, Alemanha."),
    "savanna_serengeti": ("Serengeti-Landscape-2012.JPG", None, "Bjørn Christian Tørrissen", "CC BY-SA 3.0",
                          "Planície de gramíneas com acácias esparsas no Serengeti, Tanzânia."),
    "savanna_acacia": ("Acacia_(Vachellia_tortilis),_parque_nacional_Serengueti,_Tanzania,_2024-05-26,_DD_26.jpg", 7445,
                       "Diego Delso", "CC BY-SA 4.0", "Acácia (Vachellia tortilis) na savana do Parque Nacional do Serengeti, Tanzânia."),
    "cerrado": ("Cerrado_Brasileiro.jpg", 2048, "Lbotton", "ver página do arquivo",
                "Paisagem de Cerrado entre Goiânia e Brasília."),
    "prairie": ("Tallgrass_Prairie_P5300398.JPG", None, "ver página do arquivo", "CC BY-SA 4.0",
                "Pradaria de gramíneas altas em Spring Hill, Kansas (EUA)."),
    "pampa": ("Bioma_pampa.jpg", 4000, "ver página do arquivo", "ver página do arquivo",
              "Campos do Pampa no Rio Grande do Sul."),
    "steppe": ("Mongolia_steppe.JPG", 4272, "ver página do arquivo", "ver página do arquivo",
               "Estepe no centro da Mongólia."),
    "maquis": ("Maquis_and_garrigue_in_Corsica5.jpg", None, "Sten Porse", "ver página do arquivo",
               "Maquis e garrigue na Córsega: medronheiro, murta e urze."),
    "desert": ("Carnegiea_Sonoran_Desert_05.jpg", None, "Nicholas Hartmann", "ver página do arquivo",
               "Cactos saguaro e vegetação do Deserto de Sonora, Arizona (EUA)."),
    "caatinga": ("Nordestepernambucocaatingasecasergiosertao.jpg", 1500, "Sergio Sertão", "ver página do arquivo",
                 "Caatinga na estação seca no sertão de Pernambuco."),
    "defor_a": ("Desmatamento_e_Queimdas_2020_(50223707533).jpg", None, "Bruno Kelly / Amazônia Real", "CC BY 2.0",
                "Floresta derrubada e queimada na Amazônia, agosto de 2020."),
    "defor_b": ("Desmatamento_e_Queimdas_2020_(50209434097).jpg", None, "Bruno Kelly / Amazônia Real", "CC BY 2.0",
                "Queimada em área desmatada da Amazônia, agosto de 2020."),
    "fires_nasa": ("Fires_and_Deforestation_on_the_Amazon_Frontier,_Rondonia,_Brazil_-_August_12,_2007.jpg", None,
                   "NASA Earth Observatory (Jesse Allen e Robert Simmon)", "Domínio público",
                   "Imagem de satélite de queimadas e desmatamento em Rondônia, 12 de agosto de 2007."),
    "rondonia_2000": ("Amazon_deforestation_20000730.jpg", None, "NASA Earth Observatory", "Domínio público",
                      "Rondônia vista por satélite em 30 de julho de 2000."),
    "rondonia_2010": ("Amazon_deforestation_2010214.jpg", None, "NASA Earth Observatory", "Domínio público",
                      "Rondônia vista por satélite em 2 de agosto de 2010."),
    "saopaulo": ("018_Sao_Paulo_cityscape_in_Brazil_-_aerial_photo_of_Sao_Paulo.jpg", 2592, "Marek Ślusarczyk (Tupungato)",
                 "ver página do arquivo", "Vista aérea da cidade de São Paulo."),
    "mining": ("Terra_Indígena_Tenharim_do_Igarapé_Preto,_Amazonas_(41737915024).jpg", None, "Ibama (Flickr)",
               "ver página do arquivo", "Fiscalização do Ibama contra garimpo ilegal de cassiterita na Terra Indígena Tenharim do Igarapé Preto (AM), 2018."),
    "nursery": ("Viveiro_de_mudas_nativas_-_rustificação_de_mudas_em_tubetes_-_IFMG_Bambuí_MG._-_panoramio.jpg", None,
                "Panoramio (IFMG Bambuí)", "CC BY 3.0", "Viveiro de mudas de espécies nativas no IFMG, campus Bambuí (MG)."),
}

AUDIO = {
    "toucans": ("404114_felix-blume_toucans-singing-in-the-amazonian-rainforest-brazil.ogg", "Felix Blume (Freesound)",
                "ver página do arquivo", "Tucanos cantando na floresta amazônica (gravação de campo)."),
    "birds": ("Birdsong_mild_sunny_day.ogg", "stephan (PDSounds)", "Domínio público", "Canto de pássaros em um dia ameno."),
    "wind": ("Howling_wind.ogg", "Tvabutzku1234", "CC0", "Vento uivando."),
    "fire": ("Campfire_sound_ambience.ogg", "Glaneur de sons (Freesound)", "CC BY 3.0", "Fogo crepitando."),
}


def paths(name):
    name = unicodedata.normalize("NFC", name)
    h = hashlib.md5(name.encode("utf-8")).hexdigest()
    enc = quote(name, safe="()-_.,!~*'")
    return h[0], h[:2], enc


def main():
    imgs = {}
    for key, (name, w, author, lic, desc) in IMAGES.items():
        a, ab, enc = paths(name)
        imgs[key] = {"f": enc, "h": f"{a}/{ab}", "w": w, "by": author, "lic": lic, "alt": desc}
    auds = {}
    for key, (name, author, lic, desc) in AUDIO.items():
        a, ab, enc = paths(name)
        auds[key] = {"f": enc, "h": f"{a}/{ab}", "by": author, "lic": lic, "alt": desc}
    js = (
        "/* Gerado por tools/gen_media.py — registro de mídias do Wikimedia Commons. */\n"
        "window.MEDIA_IMAGES = " + json.dumps(imgs, ensure_ascii=False, indent=1) + ";\n"
        "window.MEDIA_AUDIO = " + json.dumps(auds, ensure_ascii=False, indent=1) + ";\n"
    )
    (ROOT / "src" / "media.js").write_text(js, encoding="utf-8")
    print(f"{len(imgs)} imagens, {len(auds)} sons -> src/media.js")
    write_credits()


def write_credits():
    def row(name, author, lic, desc):
        enc = quote(unicodedata.normalize("NFC", name), safe="()-_.,!~*'")
        title = name.replace("_", " ")
        unk = lambda v: "ver página do arquivo" if "ver página" in v else v
        return f"| {desc} | [{title}](https://commons.wikimedia.org/wiki/File:{enc}) | {unk(author)} | {unk(lic)} |"
    lines = [
        "# Créditos de imagens e sons",
        "",
        "Todas as fotografias e gravações abaixo são carregadas diretamente do **Wikimedia Commons** pelo navegador.",
        "Cada link leva à página do arquivo, onde estão o autor, a licença completa e a fonte original.",
        "Quando a coluna diz “ver página do arquivo”, consulte o link para a atribuição exata.",
        "",
        "## Imagens",
        "",
        "| Uso | Arquivo | Autor | Licença |",
        "|---|---|---|---|",
    ]
    lines += [row(n, a, l, d) for (n, w, a, l, d) in IMAGES.values()]
    lines += [
        "",
        "## Sons (gravações reais)",
        "",
        "| Uso | Arquivo | Autor | Licença |",
        "|---|---|---|---|",
    ]
    lines += [row(n, a, l, d) for (n, a, l, d) in AUDIO.values()]
    lines += [
        "",
        "## Outros recursos",
        "",
        "- **Texturas do globo:** NASA Blue Marble (superfície) e NASA Black Marble (luzes noturnas), domínio público; obtidas do pacote de código aberto [three-globe](https://github.com/vasturiano/three-globe) (licença MIT). A máscara de oceanos vem do mesmo pacote.",
        "- **Trilha instrumental e efeitos sonoros:** sintetizados em tempo real no navegador com a Web Audio API (nenhum arquivo externo).",
        "- **Fontes tipográficas:** Bricolage Grotesque, Instrument Serif, Manrope e JetBrains Mono, via Google Fonts (SIL Open Font License).",
        "- **Dados citados:** FAO, Avaliação dos Recursos Florestais Globais (FRA 2020) e Levantamento por Sensoriamento Remoto (2021); SOS Mata Atlântica e INPE; MapBiomas; Relatório Brundtland (ONU, 1987).",
        "",
    ]
    (ROOT / "CREDITOS.md").write_text("\n".join(lines), encoding="utf-8")
    print("CREDITOS.md atualizado")


if __name__ == "__main__":
    main()

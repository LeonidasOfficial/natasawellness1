/**
 * Translations of the admin-managed price list (categories and treatments),
 * keyed by the stored category/treatment id.
 *
 * Each entry records the Serbian text (`sr`) it was translated from. A
 * translation is only shown while the item's current Serbian text still
 * matches that source; if the owner edits the Serbian text in the admin panel,
 * the stale translation is ignored (per-language fields saved in the admin
 * panel take priority over this file anyway).
 *
 * Generated from the live price list on 2026-10-28.
 */
export interface CategoryTextFields {
  category?: string
  description?: string
  footnote?: string
}

export interface TreatmentTextFields {
  name?: string
  description?: string
}

export type TranslatedLocale = 'en' | 'fr' | 'de'

export type ContentTranslation<T> = { sr: T } & Partial<Record<TranslatedLocale, T>>

export const categoryContentTranslations: Record<string, ContentTranslation<CategoryTextFields>> = {
  "1": {
    "sr": {
      "category": "Tretmani Lica",
      "description": "Tretmani lica uz primenu visokokvalitetne kozmetike, prilagođeni potrebama različitih tipova kože.\n*uključuje depilaciju nausnica i obrva",
      "footnote": "* uključuje depilaciju nausnica i obrva"
    },
    "en": {
      "category": "Facial Treatments",
      "description": "Facial treatments using high-quality cosmetics, tailored to the needs of different skin types.\n*includes upper lip and eyebrow waxing",
      "footnote": "* includes upper lip and eyebrow waxing"
    },
    "fr": {
      "category": "Soins du visage",
      "description": "Soins du visage réalisés avec des cosmétiques de haute qualité, adaptés aux besoins de chaque type de peau.\n*comprend l'épilation de la lèvre supérieure et des sourcils",
      "footnote": "* comprend l'épilation de la lèvre supérieure et des sourcils"
    },
    "de": {
      "category": "Gesichtsbehandlungen",
      "description": "Gesichtsbehandlungen mit hochwertiger Kosmetik, abgestimmt auf die Bedürfnisse verschiedener Hauttypen.\n*inklusive Oberlippen- und Augenbrauenepilation",
      "footnote": "* inklusive Oberlippen- und Augenbrauenepilation"
    }
  },
  "2": {
    "sr": {
      "category": "Depilacija / Voskom",
      "description": "Uklanjanje neželjenih dlačica kvalitetnim voskom za glatku i negovanu kožu.",
      "footnote": "*vreme depilacije zavisi od rasta,količine i debljine dlake"
    },
    "en": {
      "category": "Waxing",
      "description": "Removal of unwanted hair with quality wax for smooth, well-cared-for skin.",
      "footnote": "*waxing time depends on hair growth, density and thickness"
    },
    "fr": {
      "category": "Épilation à la cire",
      "description": "Élimination des poils indésirables avec une cire de qualité pour une peau lisse et soignée.",
      "footnote": "*la durée de l'épilation dépend de la pousse, de la densité et de l'épaisseur des poils"
    },
    "de": {
      "category": "Waxing / Haarentfernung mit Wachs",
      "description": "Entfernung unerwünschter Haare mit hochwertigem Wachs für glatte, gepflegte Haut.",
      "footnote": "*die Dauer der Haarentfernung hängt von Wachstum, Dichte und Stärke der Haare ab"
    }
  },
  "3": {
    "sr": {
      "category": "Pedikir",
      "description": "Skraćivanje i oblikovanje noktiju, nega zanoktica, uklanjanje zadebljale kože sa stopala i peta. * Nega uraslih noktiju bez znakova infekcije i kurjih očiju, prema proceni na licu mesta"
    },
    "en": {
      "category": "Pedicure",
      "description": "Trimming and shaping of nails, cuticle care, removal of hardened skin from feet and heels. * Treatment of ingrown nails (without signs of infection) and corns, subject to on-site assessment"
    },
    "fr": {
      "category": "Pédicure",
      "description": "Coupe et mise en forme des ongles, soin des cuticules, élimination des callosités des pieds et des talons. * Soin des ongles incarnés (sans signe d'infection) et des cors, selon évaluation sur place"
    },
    "de": {
      "category": "Pediküre",
      "description": "Kürzen und Formen der Nägel, Nagelhautpflege, Entfernung von Hornhaut an Füßen und Fersen. * Behandlung eingewachsener Nägel (ohne Anzeichen einer Infektion) und Hühneraugen nach Beurteilung vor Ort"
    }
  },
  "4": {
    "sr": {
      "category": "Pedikir sa gel lakom (GL)",
      "description": "Kompletna nega stopala i noktiju, uz nanošenje gel laka za dogtrajan i uredan izgled noktiju."
    },
    "en": {
      "category": "Pedicure with Gel Polish (GL)",
      "description": "Complete foot and nail care with gel polish application for long-lasting, neat-looking nails."
    },
    "fr": {
      "category": "Pédicure avec vernis gel (GL)",
      "description": "Soin complet des pieds et des ongles avec application de vernis gel pour des ongles impeccables et durables."
    },
    "de": {
      "category": "Pediküre mit Gellack (GL)",
      "description": "Komplette Fuß- und Nagelpflege mit Gellack-Auftrag für lang anhaltend gepflegte Nägel."
    }
  },
  "5": {
    "sr": {
      "category": "Manikir",
      "description": "Oblikovanje noktiju, skraćivanje i turpijanje, nega zanoktica i uređen izgled noktiju."
    },
    "en": {
      "category": "Manicure",
      "description": "Nail shaping, trimming and filing, and cuticle care for neat, well-groomed nails."
    },
    "fr": {
      "category": "Manucure",
      "description": "Mise en forme, coupe et limage des ongles, soin des cuticules pour des ongles nets et soignés."
    },
    "de": {
      "category": "Maniküre",
      "description": "Formen, Kürzen und Feilen der Nägel sowie Nagelhautpflege für gepflegte Nägel."
    }
  },
  "6": {
    "sr": {
      "category": "Manikir sa gel lakom (GL)",
      "description": "Klasičan manikir koji uključuje oblikovanje noktiju, nega zanoktice i nanošenje gel laka za dugotrajan i uredan izgled noktiju."
    },
    "en": {
      "category": "Manicure with Gel Polish (GL)",
      "description": "Classic manicure including nail shaping, cuticle care and gel polish application for long-lasting, neat-looking nails."
    },
    "fr": {
      "category": "Manucure avec vernis gel (GL)",
      "description": "Manucure classique comprenant la mise en forme des ongles, le soin des cuticules et l'application de vernis gel pour des ongles impeccables et durables."
    },
    "de": {
      "category": "Maniküre mit Gellack (GL)",
      "description": "Klassische Maniküre mit Nagelformung, Nagelhautpflege und Gellack-Auftrag für lang anhaltend gepflegte Nägel."
    }
  },
  "7": {
    "sr": {
      "category": "Manikir + ojačavanje i nadogradnja noktiju",
      "description": "Ojačavanje prirodnih noktiju gelom ili poligelom, kao i nadogradnja noktiju gelom ili tipsama, za čvrste, lepo oblikovane i negovane nokte.",
      "footnote": "*korekcija noktiju se preporučuje svake 3-4 nedelje"
    },
    "en": {
      "category": "Manicure + Nail Strengthening & Extensions",
      "description": "Strengthening of natural nails with gel or polygel, as well as nail extensions with gel or tips, for strong, beautifully shaped and well-groomed nails.",
      "footnote": "*a nail refill is recommended every 3-4 weeks"
    },
    "fr": {
      "category": "Manucure + renforcement et extension des ongles",
      "description": "Renforcement des ongles naturels au gel ou au polygel, ainsi qu'extension des ongles au gel ou avec capsules, pour des ongles solides, bien formés et soignés.",
      "footnote": "*un remplissage est recommandé toutes les 3 à 4 semaines"
    },
    "de": {
      "category": "Maniküre + Nagelverstärkung & Nagelverlängerung",
      "description": "Verstärkung der Naturnägel mit Gel oder Polygel sowie Nagelverlängerung mit Gel oder Tips für feste, schön geformte und gepflegte Nägel.",
      "footnote": "*eine Nagelkorrektur wird alle 3-4 Wochen empfohlen"
    }
  },
  "8": {
    "sr": {
      "category": "Farbanje trepavice i obrve / Lash lift + brow lift",
      "description": "Tretmani za isticanje prirodne lepote trepavica i obrva, za naglašeniji, uredan i negovan izgled."
    },
    "en": {
      "category": "Lash & Brow Tinting / Lash Lift + Brow Lift",
      "description": "Treatments that enhance the natural beauty of your lashes and brows for a more defined, neat and polished look."
    },
    "fr": {
      "category": "Teinture des cils et sourcils / Lash lift + brow lift",
      "description": "Soins qui subliment la beauté naturelle des cils et des sourcils pour un regard plus intense, net et soigné."
    },
    "de": {
      "category": "Wimpern- & Augenbrauenfärben / Lash Lift + Brow Lift",
      "description": "Behandlungen, die die natürliche Schönheit von Wimpern und Augenbrauen betonen – für einen ausdrucksstärkeren, gepflegten Look."
    }
  },
  "9": {
    "sr": {
      "category": "Supreme Wellbeing / Vrhunsko blagostanje",
      "description": "Posebno osmišljeni trenuci opuštanja i blagostanja, namenjeni isključivo ženama."
    },
    "en": {
      "category": "Supreme Wellbeing",
      "description": "Specially designed moments of relaxation and wellbeing, exclusively for women."
    },
    "fr": {
      "category": "Supreme Wellbeing / Bien-être suprême",
      "description": "Des moments de détente et de bien-être spécialement conçus, réservés exclusivement aux femmes."
    },
    "de": {
      "category": "Supreme Wellbeing / Höchstes Wohlbefinden",
      "description": "Speziell gestaltete Momente der Entspannung und des Wohlbefindens – ausschließlich für Frauen."
    }
  },
  "10": {
    "sr": {
      "category": "Šminkanje",
      "description": "Profesionalno šminkanhe za posebne prilike, uz isticanje prirodne lepote i prilagođavanje izgleda vašim željama."
    },
    "en": {
      "category": "Makeup",
      "description": "Professional makeup for special occasions, enhancing your natural beauty and tailoring the look to your wishes."
    },
    "fr": {
      "category": "Maquillage",
      "description": "Maquillage professionnel pour les occasions spéciales, qui met en valeur votre beauté naturelle et s'adapte à vos envies."
    },
    "de": {
      "category": "Make-up",
      "description": "Professionelles Make-up für besondere Anlässe, das Ihre natürliche Schönheit betont und ganz auf Ihre Wünsche abgestimmt ist."
    }
  },
  "11": {
    "sr": {
      "category": "Sprej Ten",
      "description": "Profesionalno samopotamnjivanje za preplanuli ten prirodnog izgled, bez izlaganja suncu."
    },
    "en": {
      "category": "Spray Tan",
      "description": "Professional self-tanning for a natural-looking, sun-kissed glow without sun exposure."
    },
    "fr": {
      "category": "Bronzage en spray",
      "description": "Autobronzage professionnel pour un teint hâlé d'aspect naturel, sans exposition au soleil."
    },
    "de": {
      "category": "Spray Tanning",
      "description": "Professionelle Selbstbräunung für einen natürlich wirkenden, sonnengeküssten Teint – ganz ohne Sonne."
    }
  },
  "1793107963810": {
    "sr": {
      "category": "Muški Tretmani",
      "description": "Profesionalna nega lica, ruke i stopala, kao depilacija voskom* za muškarci."
    },
    "en": {
      "category": "Men's Treatments",
      "description": "Professional face, hand and foot care, as well as waxing*, for men."
    },
    "fr": {
      "category": "Soins pour hommes",
      "description": "Soins professionnels du visage, des mains et des pieds, ainsi qu'épilation à la cire*, pour hommes."
    },
    "de": {
      "category": "Behandlungen für Männer",
      "description": "Professionelle Gesichts-, Hand- und Fußpflege sowie Waxing* für Männer."
    }
  }
}

export const treatmentContentTranslations: Record<string, ContentTranslation<TreatmentTextFields>> = {
  "1": {
    "sr": {
      "name": "Brzi tretman lica",
      "description": "30min (bez depilacije)"
    },
    "en": {
      "name": "Express facial",
      "description": "30 min (without waxing)"
    },
    "fr": {
      "name": "Soin du visage express",
      "description": "30 min (sans épilation)"
    },
    "de": {
      "name": "Express-Gesichtsbehandlung",
      "description": "30 Min. (ohne Epilation)"
    }
  },
  "2": {
    "sr": {
      "name": "Tretman lica mladih*",
      "description": "60min (12-22god)"
    },
    "en": {
      "name": "Teen facial*",
      "description": "60 min (ages 12-22)"
    },
    "fr": {
      "name": "Soin du visage jeunes*",
      "description": "60 min (12-22 ans)"
    },
    "de": {
      "name": "Gesichtsbehandlung für junge Haut*",
      "description": "60 Min. (12-22 Jahre)"
    }
  },
  "3": {
    "sr": {
      "name": "Moj tretman*",
      "description": "Nega lica za sve potrebe: suva, osetljiva, tupa-umorna, problematične-masna zrela... kože 75min"
    },
    "en": {
      "name": "My Facial*",
      "description": "Facial care for every need: dry, sensitive, dull/tired, problem/oily, mature... skin 75 min"
    },
    "fr": {
      "name": "Mon soin*",
      "description": "Soin du visage pour tous les besoins : peaux sèches, sensibles, ternes/fatiguées, à problèmes/grasses, matures... 75 min"
    },
    "de": {
      "name": "Meine Behandlung*",
      "description": "Gesichtspflege für jedes Bedürfnis: trockene, empfindliche, fahle/müde, unreine/fettige, reife ... Haut 75 Min."
    }
  },
  "4": {
    "sr": {
      "name": "Anti-age tretman*",
      "description": "Tretman za negu zrele kože, poboljšanje elastičnosti i očuvanje mladalačkog izgleda 90min"
    },
    "en": {
      "name": "Anti-ageing facial*",
      "description": "Treatment for mature skin that improves elasticity and preserves a youthful look 90 min"
    },
    "fr": {
      "name": "Soin anti-âge*",
      "description": "Soin des peaux matures qui améliore l'élasticité et préserve un aspect jeune 90 min"
    },
    "de": {
      "name": "Anti-Aging-Behandlung*",
      "description": "Pflege für reife Haut, die die Elastizität verbessert und ein jugendliches Aussehen bewahrt 90 Min."
    }
  },
  "5": {
    "sr": {
      "name": "Mikrodermoabrazija lica + tretman",
      "description": "75min"
    },
    "en": {
      "name": "Facial microdermabrasion + treatment",
      "description": "75 min"
    },
    "fr": {
      "name": "Microdermabrasion du visage + soin",
      "description": "75 min"
    },
    "de": {
      "name": "Mikrodermabrasion + Gesichtsbehandlung",
      "description": "75 Min."
    }
  },
  "dep1": {
    "sr": {
      "name": "Korekcija obrva pincetom"
    },
    "en": {
      "name": "Eyebrow shaping with tweezers"
    },
    "fr": {
      "name": "Correction des sourcils à la pince"
    },
    "de": {
      "name": "Augenbrauenkorrektur mit der Pinzette"
    }
  },
  "dep2": {
    "sr": {
      "name": "Obrva"
    },
    "en": {
      "name": "Eyebrows"
    },
    "fr": {
      "name": "Sourcils"
    },
    "de": {
      "name": "Augenbrauen"
    }
  },
  "dep3": {
    "sr": {
      "name": "Nausnica"
    },
    "en": {
      "name": "Upper lip"
    },
    "fr": {
      "name": "Lèvre supérieure"
    },
    "de": {
      "name": "Oberlippe"
    }
  },
  "dep4": {
    "sr": {
      "name": "Nausnica + obrva"
    },
    "en": {
      "name": "Upper lip + eyebrows"
    },
    "fr": {
      "name": "Lèvre supérieure + sourcils"
    },
    "de": {
      "name": "Oberlippe + Augenbrauen"
    }
  },
  "dep5": {
    "sr": {
      "name": "Lica (bez obrva)"
    },
    "en": {
      "name": "Face (without eyebrows)"
    },
    "fr": {
      "name": "Visage (sans les sourcils)"
    },
    "de": {
      "name": "Gesicht (ohne Augenbrauen)"
    }
  },
  "dep6": {
    "sr": {
      "name": "Bikini zona (prepone)"
    },
    "en": {
      "name": "Bikini line"
    },
    "fr": {
      "name": "Maillot (aine)"
    },
    "de": {
      "name": "Bikinizone (Leiste)"
    }
  },
  "dep7": {
    "sr": {
      "name": "Bikini kompletan (brazilska)"
    },
    "en": {
      "name": "Full bikini (Brazilian)"
    },
    "fr": {
      "name": "Maillot intégral (brésilien)"
    },
    "de": {
      "name": "Bikini komplett (Brazilian)"
    }
  },
  "dep8": {
    "sr": {
      "name": "Pazuha"
    },
    "en": {
      "name": "Underarms"
    },
    "fr": {
      "name": "Aisselles"
    },
    "de": {
      "name": "Achseln"
    }
  },
  "dep9": {
    "sr": {
      "name": "Depilacija 15min"
    },
    "en": {
      "name": "Waxing 15 min"
    },
    "fr": {
      "name": "Épilation 15 min"
    },
    "de": {
      "name": "Waxing 15 Min."
    }
  },
  "dep10": {
    "sr": {
      "name": "Depilacija 30min",
      "description": "na primer 1/2 noge+bik+pazuha / grudi, leđa..."
    },
    "en": {
      "name": "Waxing 30 min",
      "description": "e.g. half legs + bikini + underarms / chest, back..."
    },
    "fr": {
      "name": "Épilation 30 min",
      "description": "par ex. demi-jambes + maillot + aisselles / torse, dos..."
    },
    "de": {
      "name": "Waxing 30 Min.",
      "description": "z. B. halbe Beine + Bikini + Achseln / Brust, Rücken..."
    }
  },
  "dep11": {
    "sr": {
      "name": "Depilacija 45min",
      "description": "na primer 1/1 noga+bik / grudi + leđa + pazuha..."
    },
    "en": {
      "name": "Waxing 45 min",
      "description": "e.g. full legs + bikini / chest + back + underarms..."
    },
    "fr": {
      "name": "Épilation 45 min",
      "description": "par ex. jambes complètes + maillot / torse + dos + aisselles..."
    },
    "de": {
      "name": "Waxing 45 Min.",
      "description": "z. B. ganze Beine + Bikini / Brust + Rücken + Achseln..."
    }
  },
  "dep12": {
    "sr": {
      "name": "Depilacija 60min",
      "description": "na primer 1/1 noga+bik kompletan + pazuha + lice..."
    },
    "en": {
      "name": "Waxing 60 min",
      "description": "e.g. full legs + full bikini + underarms + face..."
    },
    "fr": {
      "name": "Épilation 60 min",
      "description": "par ex. jambes complètes + maillot intégral + aisselles + visage..."
    },
    "de": {
      "name": "Waxing 60 Min.",
      "description": "z. B. ganze Beine + Bikini komplett + Achseln + Gesicht..."
    }
  },
  "dep13": {
    "sr": {
      "name": "Depilacija 90min",
      "description": "na primer 1/1 noge+ grudi +leđa +pazuha +ruke"
    },
    "en": {
      "name": "Waxing 90 min",
      "description": "e.g. full legs + chest + back + underarms + arms"
    },
    "fr": {
      "name": "Épilation 90 min",
      "description": "par ex. jambes complètes + torse + dos + aisselles + bras"
    },
    "de": {
      "name": "Waxing 90 Min.",
      "description": "z. B. ganze Beine + Brust + Rücken + Achseln + Arme"
    }
  },
  "ped1": {
    "sr": {
      "name": "Pedikir"
    },
    "en": {
      "name": "Pedicure"
    },
    "fr": {
      "name": "Pédicure"
    },
    "de": {
      "name": "Pediküre"
    }
  },
  "ped2": {
    "sr": {
      "name": "Pedikir + lak"
    },
    "en": {
      "name": "Pedicure + polish"
    },
    "fr": {
      "name": "Pédicure + vernis"
    },
    "de": {
      "name": "Pediküre + Lack"
    }
  },
  "ped3": {
    "sr": {
      "name": "Pedikir + lak + dekoracija",
      "description": "cirkoni,šljokice…"
    },
    "en": {
      "name": "Pedicure + polish + decoration",
      "description": "rhinestones, glitter..."
    },
    "fr": {
      "name": "Pédicure + vernis + décoration",
      "description": "strass, paillettes..."
    },
    "de": {
      "name": "Pediküre + Lack + Verzierung",
      "description": "Strasssteine, Glitzer..."
    }
  },
  "ped4": {
    "sr": {
      "name": "Deko 1x",
      "description": "cirkoni, šljokice..."
    },
    "en": {
      "name": "Decoration 1x",
      "description": "rhinestones, glitter..."
    },
    "fr": {
      "name": "Décoration 1x",
      "description": "strass, paillettes..."
    },
    "de": {
      "name": "Verzierung 1x",
      "description": "Strasssteine, Glitzer..."
    }
  },
  "ped5": {
    "sr": {
      "name": "Samo lak"
    },
    "en": {
      "name": "Polish only"
    },
    "fr": {
      "name": "Vernis uniquement"
    },
    "de": {
      "name": "Nur Lack"
    }
  },
  "pedgl1": {
    "sr": {
      "name": "Pedikir + GL"
    },
    "en": {
      "name": "Pedicure + gel polish"
    },
    "fr": {
      "name": "Pédicure + vernis gel"
    },
    "de": {
      "name": "Pediküre + Gellack"
    }
  },
  "pedgl2": {
    "sr": {
      "name": "Pedikir + GL + deko",
      "description": "cirkoni, šljokice..."
    },
    "en": {
      "name": "Pedicure + gel polish + decoration",
      "description": "rhinestones, glitter..."
    },
    "fr": {
      "name": "Pédicure + vernis gel + décoration",
      "description": "strass, paillettes..."
    },
    "de": {
      "name": "Pediküre + Gellack + Verzierung",
      "description": "Strasssteine, Glitzer..."
    }
  },
  "pedgl3": {
    "sr": {
      "name": "Deko 1x",
      "description": "cirkoni, šljokice..."
    },
    "en": {
      "name": "Decoration 1x",
      "description": "rhinestones, glitter..."
    },
    "fr": {
      "name": "Décoration 1x",
      "description": "strass, paillettes..."
    },
    "de": {
      "name": "Verzierung 1x",
      "description": "Strasssteine, Glitzer..."
    }
  },
  "pedgl4": {
    "sr": {
      "name": "Pedikir + skidanje GL"
    },
    "en": {
      "name": "Pedicure + gel polish removal"
    },
    "fr": {
      "name": "Pédicure + dépose du vernis gel"
    },
    "de": {
      "name": "Pediküre + Gellack-Entfernung"
    }
  },
  "1780324730119": {
    "sr": {
      "name": "Pedikir + skidanje GL + Lak"
    },
    "en": {
      "name": "Pedicure + gel polish removal + polish"
    },
    "fr": {
      "name": "Pédicure + dépose du vernis gel + vernis"
    },
    "de": {
      "name": "Pediküre + Gellack-Entfernung + Lack"
    }
  },
  "man1": {
    "sr": {
      "name": "Manikir"
    },
    "en": {
      "name": "Manicure"
    },
    "fr": {
      "name": "Manucure"
    },
    "de": {
      "name": "Maniküre"
    }
  },
  "man2": {
    "sr": {
      "name": "Manikir + lak"
    },
    "en": {
      "name": "Manicure + polish"
    },
    "fr": {
      "name": "Manucure + vernis"
    },
    "de": {
      "name": "Maniküre + Lack"
    }
  },
  "man3": {
    "sr": {
      "name": "Manikir + french lak"
    },
    "en": {
      "name": "Manicure + French polish"
    },
    "fr": {
      "name": "Manucure + french"
    },
    "de": {
      "name": "Maniküre + French-Lack"
    }
  },
  "man4": {
    "sr": {
      "name": "Manikir + lak + deko",
      "description": "cirkoni, šljokice..."
    },
    "en": {
      "name": "Manicure + polish + decoration",
      "description": "rhinestones, glitter..."
    },
    "fr": {
      "name": "Manucure + vernis + décoration",
      "description": "strass, paillettes..."
    },
    "de": {
      "name": "Maniküre + Lack + Verzierung",
      "description": "Strasssteine, Glitzer..."
    }
  },
  "man5": {
    "sr": {
      "name": "Samo lak"
    },
    "en": {
      "name": "Polish only"
    },
    "fr": {
      "name": "Vernis uniquement"
    },
    "de": {
      "name": "Nur Lack"
    }
  },
  "mangl1": {
    "sr": {
      "name": "Gel lak S"
    },
    "en": {
      "name": "Gel polish S"
    },
    "fr": {
      "name": "Vernis gel S"
    },
    "de": {
      "name": "Gellack S"
    }
  },
  "mangl2": {
    "sr": {
      "name": "Gel lak M"
    },
    "en": {
      "name": "Gel polish M"
    },
    "fr": {
      "name": "Vernis gel M"
    },
    "de": {
      "name": "Gellack M"
    }
  },
  "mangl3": {
    "sr": {
      "name": "Gel lak L"
    },
    "en": {
      "name": "Gel polish L"
    },
    "fr": {
      "name": "Vernis gel L"
    },
    "de": {
      "name": "Gellack L"
    }
  },
  "mangl4": {
    "sr": {
      "name": "Manikir + skidanje GL"
    },
    "en": {
      "name": "Manicure + gel polish removal"
    },
    "fr": {
      "name": "Manucure + dépose du vernis gel"
    },
    "de": {
      "name": "Maniküre + Gellack-Entfernung"
    }
  },
  "mangl5": {
    "sr": {
      "name": "Crtanje po noktu",
      "description": "+cirkoni, šljokice.."
    },
    "en": {
      "name": "Nail art",
      "description": "+rhinestones, glitter..."
    },
    "fr": {
      "name": "Nail art",
      "description": "+strass, paillettes..."
    },
    "de": {
      "name": "Nail Art",
      "description": "+Strasssteine, Glitzer..."
    }
  },
  "mang1": {
    "sr": {
      "name": "Ojačavanje S"
    },
    "en": {
      "name": "Strengthening S"
    },
    "fr": {
      "name": "Renforcement S"
    },
    "de": {
      "name": "Verstärkung S"
    }
  },
  "mang2": {
    "sr": {
      "name": "Ojačavanje M"
    },
    "en": {
      "name": "Strengthening M"
    },
    "fr": {
      "name": "Renforcement M"
    },
    "de": {
      "name": "Verstärkung M"
    }
  },
  "mang3": {
    "sr": {
      "name": "Ojačavanje L"
    },
    "en": {
      "name": "Strengthening L"
    },
    "fr": {
      "name": "Renforcement L"
    },
    "de": {
      "name": "Verstärkung L"
    }
  },
  "mang4": {
    "sr": {
      "name": "Izlivanje sa šablonom ili dual tips S"
    },
    "en": {
      "name": "Extension with forms or dual tips S"
    },
    "fr": {
      "name": "Extension au chablon ou dual tips S"
    },
    "de": {
      "name": "Modellage mit Schablone oder Dual Tips S"
    }
  },
  "mang5": {
    "sr": {
      "name": "Izlivanje sa šablonom ili dual tips M"
    },
    "en": {
      "name": "Extension with forms or dual tips M"
    },
    "fr": {
      "name": "Extension au chablon ou dual tips M"
    },
    "de": {
      "name": "Modellage mit Schablone oder Dual Tips M"
    }
  },
  "mang6": {
    "sr": {
      "name": "Izlivanje sa šablonom ili dual tips L"
    },
    "en": {
      "name": "Extension with forms or dual tips L"
    },
    "fr": {
      "name": "Extension au chablon ou dual tips L"
    },
    "de": {
      "name": "Modellage mit Schablone oder Dual Tips L"
    }
  },
  "mang7": {
    "sr": {
      "name": "Korekcija S"
    },
    "en": {
      "name": "Refill S"
    },
    "fr": {
      "name": "Remplissage S"
    },
    "de": {
      "name": "Auffüllen S"
    }
  },
  "mang8": {
    "sr": {
      "name": "Korekcija M"
    },
    "en": {
      "name": "Refill M"
    },
    "fr": {
      "name": "Remplissage M"
    },
    "de": {
      "name": "Auffüllen M"
    }
  },
  "mang9": {
    "sr": {
      "name": "Korekcija L"
    },
    "en": {
      "name": "Refill L"
    },
    "fr": {
      "name": "Remplissage L"
    },
    "de": {
      "name": "Auffüllen L"
    }
  },
  "mang10": {
    "sr": {
      "name": "Nadogradnja noktiju tipsama S"
    },
    "en": {
      "name": "Nail extensions with tips S"
    },
    "fr": {
      "name": "Extension des ongles avec capsules S"
    },
    "de": {
      "name": "Nagelverlängerung mit Tips S"
    }
  },
  "mang11": {
    "sr": {
      "name": "Nadogradnja noktiju tipsama M"
    },
    "en": {
      "name": "Nail extensions with tips M"
    },
    "fr": {
      "name": "Extension des ongles avec capsules M"
    },
    "de": {
      "name": "Nagelverlängerung mit Tips M"
    }
  },
  "mang12": {
    "sr": {
      "name": "Nadogradnja noktiju tipsama L"
    },
    "en": {
      "name": "Nail extensions with tips L"
    },
    "fr": {
      "name": "Extension des ongles avec capsules L"
    },
    "de": {
      "name": "Nagelverlängerung mit Tips L"
    }
  },
  "mang13": {
    "sr": {
      "name": "French"
    },
    "en": {
      "name": "French"
    },
    "fr": {
      "name": "French"
    },
    "de": {
      "name": "French"
    }
  },
  "mang14": {
    "sr": {
      "name": "Babyboom/Ombre"
    },
    "en": {
      "name": "Babyboom/Ombre"
    },
    "fr": {
      "name": "Babyboom/Ombré"
    },
    "de": {
      "name": "Babyboom/Ombré"
    }
  },
  "mang15": {
    "sr": {
      "name": "Popravi nokat S"
    },
    "en": {
      "name": "Nail repair S"
    },
    "fr": {
      "name": "Réparation d'un ongle S"
    },
    "de": {
      "name": "Nagelreparatur S"
    }
  },
  "mang16": {
    "sr": {
      "name": "Popravi nokat M"
    },
    "en": {
      "name": "Nail repair M"
    },
    "fr": {
      "name": "Réparation d'un ongle M"
    },
    "de": {
      "name": "Nagelreparatur M"
    }
  },
  "mang17": {
    "sr": {
      "name": "Popravi nokat L"
    },
    "en": {
      "name": "Nail repair L"
    },
    "fr": {
      "name": "Réparation d'un ongle L"
    },
    "de": {
      "name": "Nagelreparatur L"
    }
  },
  "mang18": {
    "sr": {
      "name": "Crtanje po noktu",
      "description": "+cirkoni, šljokice..."
    },
    "en": {
      "name": "Nail art",
      "description": "+rhinestones, glitter..."
    },
    "fr": {
      "name": "Nail art",
      "description": "+strass, paillettes..."
    },
    "de": {
      "name": "Nail Art",
      "description": "+Strasssteine, Glitzer..."
    }
  },
  "mang19": {
    "sr": {
      "name": "Skidanje Gel / Gum Gel ili Poligel + Gel Lak + manikir"
    },
    "en": {
      "name": "Removal of gel / gum gel or polygel + gel polish + manicure"
    },
    "fr": {
      "name": "Dépose gel / gum gel ou polygel + vernis gel + manucure"
    },
    "de": {
      "name": "Entfernung von Gel / Gum Gel oder Polygel + Gellack + Maniküre"
    }
  },
  "1780324972634": {
    "sr": {
      "name": "Skidanje Gel /Gum Gel ili Poligel + manikir + lak"
    },
    "en": {
      "name": "Removal of gel / gum gel or polygel + manicure + polish"
    },
    "fr": {
      "name": "Dépose gel / gum gel ou polygel + manucure + vernis"
    },
    "de": {
      "name": "Entfernung von Gel / Gum Gel oder Polygel + Maniküre + Lack"
    }
  },
  "1791645684290": {
    "sr": {
      "name": "Chrome"
    },
    "en": {
      "name": "Chrome"
    },
    "fr": {
      "name": "Chrome"
    },
    "de": {
      "name": "Chrome"
    }
  },
  "lash1": {
    "sr": {
      "name": "Farbanje trepavica"
    },
    "en": {
      "name": "Lash tinting"
    },
    "fr": {
      "name": "Teinture des cils"
    },
    "de": {
      "name": "Wimpern färben"
    }
  },
  "lash2": {
    "sr": {
      "name": "Farbanje obrva"
    },
    "en": {
      "name": "Brow tinting"
    },
    "fr": {
      "name": "Teinture des sourcils"
    },
    "de": {
      "name": "Augenbrauen färben"
    }
  },
  "lash3": {
    "sr": {
      "name": "Farbanje trepavica + obrva"
    },
    "en": {
      "name": "Lash + brow tinting"
    },
    "fr": {
      "name": "Teinture des cils + sourcils"
    },
    "de": {
      "name": "Wimpern + Augenbrauen färben"
    }
  },
  "lash4": {
    "sr": {
      "name": "Podizanje trepavica (lash lift)"
    },
    "en": {
      "name": "Lash lift"
    },
    "fr": {
      "name": "Rehaussement des cils (lash lift)"
    },
    "de": {
      "name": "Wimpernlifting (Lash Lift)"
    }
  },
  "lash5": {
    "sr": {
      "name": "Farbanje Trepavica + podizanje"
    },
    "en": {
      "name": "Lash tinting + lift"
    },
    "fr": {
      "name": "Teinture + rehaussement des cils"
    },
    "de": {
      "name": "Wimpern färben + Lifting"
    }
  },
  "lash6": {
    "sr": {
      "name": "Farbanje obrva + trepavica + podizanje"
    },
    "en": {
      "name": "Brow + lash tinting + lash lift"
    },
    "fr": {
      "name": "Teinture sourcils + cils + rehaussement"
    },
    "de": {
      "name": "Augenbrauen + Wimpern färben + Lifting"
    }
  },
  "lash7": {
    "sr": {
      "name": "Podizanje obrva (brow lift)"
    },
    "en": {
      "name": "Brow lift"
    },
    "fr": {
      "name": "Rehaussement des sourcils (brow lift)"
    },
    "de": {
      "name": "Augenbrauenlifting (Brow Lift)"
    }
  },
  "lash8": {
    "sr": {
      "name": "Farbanje + podizanje obrva (brow lift)"
    },
    "en": {
      "name": "Brow tinting + brow lift"
    },
    "fr": {
      "name": "Teinture + rehaussement des sourcils (brow lift)"
    },
    "de": {
      "name": "Augenbrauen färben + Lifting (Brow Lift)"
    }
  },
  "lash9": {
    "sr": {
      "name": "Farbanje + podizanje trepavica i obrva",
      "description": "farbanje + lash lift +brow lift"
    },
    "en": {
      "name": "Lash & brow tinting + lift",
      "description": "tinting + lash lift + brow lift"
    },
    "fr": {
      "name": "Teinture + rehaussement des cils et sourcils",
      "description": "teinture + lash lift + brow lift"
    },
    "de": {
      "name": "Wimpern & Augenbrauen färben + Lifting",
      "description": "Färben + Lash Lift + Brow Lift"
    }
  },
  "well1": {
    "sr": {
      "name": "Masaža 30min"
    },
    "en": {
      "name": "Massage 30 min"
    },
    "fr": {
      "name": "Massage 30 min"
    },
    "de": {
      "name": "Massage 30 Min."
    }
  },
  "well2": {
    "sr": {
      "name": "Masaža 45min"
    },
    "en": {
      "name": "Massage 45 min"
    },
    "fr": {
      "name": "Massage 45 min"
    },
    "de": {
      "name": "Massage 45 Min."
    }
  },
  "well3": {
    "sr": {
      "name": "Masaža 60min"
    },
    "en": {
      "name": "Massage 60 min"
    },
    "fr": {
      "name": "Massage 60 min"
    },
    "de": {
      "name": "Massage 60 Min."
    }
  },
  "well4": {
    "sr": {
      "name": "Masaža 30min + tretman lica 60min",
      "description": "na primer: leđa ili stopala i ruke"
    },
    "en": {
      "name": "Massage 30 min + facial 60 min",
      "description": "e.g. back, or feet and hands"
    },
    "fr": {
      "name": "Massage 30 min + soin du visage 60 min",
      "description": "par ex. dos, ou pieds et mains"
    },
    "de": {
      "name": "Massage 30 Min. + Gesichtsbehandlung 60 Min.",
      "description": "z. B. Rücken oder Füße und Hände"
    }
  },
  "well5": {
    "sr": {
      "name": "Masaža 60min + tretman lica 60min"
    },
    "en": {
      "name": "Massage 60 min + facial 60 min"
    },
    "fr": {
      "name": "Massage 60 min + soin du visage 60 min"
    },
    "de": {
      "name": "Massage 60 Min. + Gesichtsbehandlung 60 Min."
    }
  },
  "well6": {
    "sr": {
      "name": "Refleksologija stopala (akupunktura)"
    },
    "en": {
      "name": "Foot reflexology (acupressure)"
    },
    "fr": {
      "name": "Réflexologie plantaire (acupression)"
    },
    "de": {
      "name": "Fußreflexzonenmassage (Akupressur)"
    }
  },
  "well7": {
    "sr": {
      "name": "Duboka relaksacija, pulsna vibracijska masaža 15min",
      "description": "može se uključiti u sve masaže"
    },
    "en": {
      "name": "Deep relaxation, pulse vibration massage 15 min",
      "description": "can be added to any massage"
    },
    "fr": {
      "name": "Relaxation profonde, massage par vibrations pulsées 15 min",
      "description": "peut être ajouté à tous les massages"
    },
    "de": {
      "name": "Tiefenentspannung, Puls-Vibrationsmassage 15 Min.",
      "description": "kann mit jeder Massage kombiniert werden"
    }
  },
  "well8": {
    "sr": {
      "name": "Aromaterapijska masaža 60min"
    },
    "en": {
      "name": "Aromatherapy massage 60 min"
    },
    "fr": {
      "name": "Massage aromathérapie 60 min"
    },
    "de": {
      "name": "Aromatherapie-Massage 60 Min."
    }
  },
  "well9": {
    "sr": {
      "name": "Peeling tela"
    },
    "en": {
      "name": "Body scrub"
    },
    "fr": {
      "name": "Gommage corporel"
    },
    "de": {
      "name": "Körperpeeling"
    }
  },
  "make1": {
    "sr": {
      "name": "Šminkanje ( za posebne prilike) ",
      "description": "za posebne prilike"
    },
    "en": {
      "name": "Makeup (for special occasions)",
      "description": "for special occasions"
    },
    "fr": {
      "name": "Maquillage (pour occasions spéciales)",
      "description": "pour les occasions spéciales"
    },
    "de": {
      "name": "Make-up (für besondere Anlässe)",
      "description": "für besondere Anlässe"
    }
  },
  "make2": {
    "sr": {
      "name": "Glamurozno šminkanja sa detaljima (trepavice, cirkoni.. ) "
    },
    "en": {
      "name": "Glamorous makeup with details (lashes, rhinestones...)"
    },
    "fr": {
      "name": "Maquillage glamour avec détails (faux cils, strass...)"
    },
    "de": {
      "name": "Glamour-Make-up mit Details (Wimpern, Strasssteine...)"
    }
  },
  "make4": {
    "sr": {
      "name": "Cirkoni"
    },
    "en": {
      "name": "Rhinestones"
    },
    "fr": {
      "name": "Strass"
    },
    "de": {
      "name": "Strasssteine"
    }
  },
  "tan1": {
    "sr": {
      "name": "Sprej ten - celo telo"
    },
    "en": {
      "name": "Spray tan - full body"
    },
    "fr": {
      "name": "Bronzage en spray - corps entier"
    },
    "de": {
      "name": "Spray Tan - ganzer Körper"
    }
  },
  "1793108316368": {
    "sr": {
      "name": "Pedikir",
      "description": "Profesionalna nega stopala i noktiju, uklanjanje zadebljale kože i nega peta za uredna, negovana i zdrava stopala."
    },
    "en": {
      "name": "Pedicure",
      "description": "Professional foot and nail care, removal of hardened skin and heel care for neat, well-groomed and healthy feet."
    },
    "fr": {
      "name": "Pédicure",
      "description": "Soin professionnel des pieds et des ongles, élimination des callosités et soin des talons pour des pieds nets, soignés et en bonne santé."
    },
    "de": {
      "name": "Pediküre",
      "description": "Professionelle Fuß- und Nagelpflege, Hornhautentfernung und Fersenpflege für gepflegte und gesunde Füße."
    }
  },
  "1793108493449": {
    "sr": {
      "name": "TRETMAN LICA 60-75MIN",
      "description": "Profesionalni tretman lica prilagođen potrebama muške kože, za čist, svež i negovan izgled."
    },
    "en": {
      "name": "FACIAL 60-75 MIN",
      "description": "Professional facial tailored to the needs of men's skin, for a clean, fresh and well-groomed look."
    },
    "fr": {
      "name": "SOIN DU VISAGE 60-75 MIN",
      "description": "Soin du visage professionnel adapté aux besoins de la peau masculine, pour un teint net, frais et soigné."
    },
    "de": {
      "name": "GESICHTSBEHANDLUNG 60-75 MIN.",
      "description": "Professionelle Gesichtsbehandlung, abgestimmt auf die Bedürfnisse von Männerhaut – für ein reines, frisches und gepflegtes Aussehen."
    }
  },
  "1793108647910": {
    "sr": {
      "name": "Manikir",
      "description": "Profesionalna nega noktiju i zanoktica za uredne, čiste i negovane ruke."
    },
    "en": {
      "name": "Manicure",
      "description": "Professional nail and cuticle care for neat, clean and well-groomed hands."
    },
    "fr": {
      "name": "Manucure",
      "description": "Soin professionnel des ongles et des cuticules pour des mains nettes, propres et soignées."
    },
    "de": {
      "name": "Maniküre",
      "description": "Professionelle Nagel- und Nagelhautpflege für gepflegte, saubere Hände."
    }
  },
  "1793108861532": {
    "sr": {
      "name": "Depilacija voskom za muškarce",
      "description": "Grudi"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Chest"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Torse"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Brust"
    }
  },
  "1793108915224": {
    "sr": {
      "name": "Depilacija voskom za muškarce",
      "description": "Leđa"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Back"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Dos"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Rücken"
    }
  },
  "1793109096310": {
    "sr": {
      "name": "Depilacija voskom muškarce",
      "description": "Pazuh"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Underarms"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Aisselles"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Achseln"
    }
  },
  "1793109212519": {
    "sr": {
      "name": "Depilacija voskom muškarce",
      "description": "Depilacija 15min"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Waxing 15 min"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Épilation 15 min"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Waxing 15 Min."
    }
  },
  "1793109312130": {
    "sr": {
      "name": "Depilacija voskom muškarce ",
      "description": "Nos i uši"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Nose and ears"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Nez et oreilles"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Nase und Ohren"
    }
  },
  "1793109356155": {
    "sr": {
      "name": "Depilacija voskom muškarce ",
      "description": "Nos ILI uši"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Nose OR ears"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Nez OU oreilles"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Nase ODER Ohren"
    }
  },
  "1793109492978": {
    "sr": {
      "name": "Depilacija voskom muškarce ",
      "description": "Obrve"
    },
    "en": {
      "name": "Men's waxing",
      "description": "Eyebrows"
    },
    "fr": {
      "name": "Épilation à la cire pour hommes",
      "description": "Sourcils"
    },
    "de": {
      "name": "Waxing für Männer",
      "description": "Augenbrauen"
    }
  },
  "1793109726649": {
    "sr": {
      "name": "Farbanje Obrva",
      "description": "Farbanje obrva za uredan i prirodan izgled prilagođeno muškim crtama lica."
    },
    "en": {
      "name": "Brow tinting",
      "description": "Brow tinting for a neat, natural look tailored to masculine features."
    },
    "fr": {
      "name": "Teinture des sourcils",
      "description": "Teinture des sourcils pour un regard net et naturel, adaptée aux traits masculins."
    },
    "de": {
      "name": "Augenbrauen färben",
      "description": "Augenbrauenfärbung für einen gepflegten, natürlichen Look, abgestimmt auf männliche Gesichtszüge."
    }
  }
}

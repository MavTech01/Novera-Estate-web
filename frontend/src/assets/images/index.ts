import heroMain from './hero/hero-main.webp'
import heroSlide1 from './hero/hero-slide-1.webp'
import heroSlide2 from './hero/hero-slide-2.webp'
import heroSlide3 from './hero/hero-slide-3.webp'
import heroSlide4 from './hero/hero-slide-4.webp'

import lekkiDuplex from './properties/lekki-duplex.webp'
import ajahLand from './properties/ajah-land.webp'
import gupeDuplex from './properties/gupe-duplex.webp'
import bananaIslandHome from './properties/banana-island-home.webp'
import ikoyiApartment from './properties/ikoyi-apartment.webp'
import ikejaResidence from './properties/ikeja-residence.webp'
import victoriaApartment from './properties/victoria-apartment.webp'
import yabaOffice from './properties/yaba-office.webp'

import commercial from './categories/commercial.webp'
import developments from './categories/developments.webp'
import luxury from './categories/luxury.webp'
import houses from './categories/houses.webp'
import apartments from './categories/apartments.webp'
import land from './categories/land.webp'

import ikoyi from './locations/ikoyi.webp'
import ikeja from './locations/ikeja.webp'
import ajah from './locations/ajah.webp'
import yaba from './locations/yaba.webp'
import lekki from './locations/lekki.webp'
import victoriaIsland from './locations/victoria-island.webp'

import oasisMain from './development/oasis-main.webp'
import oasisAlt from './development/oasis-alt.webp'

import buyingLand from './blog/buying-land.webp'
import investment from './blog/investment.webp'
import choosingLocation from './blog/choosing-location.webp'

import chiamaka from './team/chiamaka.webp'
import adHoc from './team/ad-hoc.webp'
import tundeB from './team/tunde-b.webp'

import ctaImage from './ui/cta-image.webp'

export const images = {
  hero: {
    main: heroMain,
    slide1: heroSlide1,
    slide2: heroSlide2,
    slide3: heroSlide3,
    slide4: heroSlide4,
  },
  properties: {
    lekkiDuplex,
    ajahLand,
    gupeDuplex,
    bananaIslandHome,
    ikoyiApartment,
    ikejaResidence,
    victoriaApartment,
    yabaOffice,
  },
  categories: {
    commercial,
    developments,
    luxury,
    houses,
    apartments,
    land,
  },
  locations: {
    ikoyi,
    ikeja,
    ajah,
    yaba,
    lekki,
    victoriaIsland,
  },
  development: {
    oasisMain,
    oasisAlt,
  },
  blog: {
    buyingLand,
    investment,
    choosingLocation,
  },
  team: {
    chiamaka,
    adHoc,
    tundeB,
  },
  ui: {
    ctaImage,
  },
} as const

import type { Oklch } from './types'

const RGB_MAX = 255

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function srgbChannelToLinear(channel: number): number {
  const normalized = channel / RGB_MAX
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

// Clamping to [0, 1] here is the engine's gamut strategy: OKLCH can describe
// colors outside sRGB, so out-of-gamut results are simply clipped rather
// than remapped. Simple and deterministic, at the cost of some accuracy at
// extreme chroma.
function linearChannelToSrgb(channel: number): number {
  const linear = clamp(channel, 0, 1)
  const gamma = linear <= 0.0031308 ? linear * 12.92 : 1.055 * linear ** (1 / 2.4) - 0.055
  return Math.round(clamp(gamma, 0, 1) * RGB_MAX)
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (channel: number) => clamp(Math.round(channel), 0, RGB_MAX).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// OKLab conversion matrices from Björn Ottosson's reference implementation
// (public domain): https://bottosson.github.io/posts/oklab/

function linearRgbToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ]
}

function oklabToLinearRgb([L, a, b]: [number, number, number]): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

export function hexToOklch(hex: string): Oklch {
  const linear = hexToRgb(hex).map(srgbChannelToLinear) as [number, number, number]
  const [l, a, b] = linearRgbToOklab(linear)
  const c = Math.sqrt(a * a + b * b)
  const hDeg = (Math.atan2(b, a) * 180) / Math.PI
  return { l, c, h: hDeg < 0 ? hDeg + 360 : hDeg }
}

export function oklchToHex({ l, c, h }: Oklch): string {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)
  const linear = oklabToLinearRgb([l, a, b])
  const rgb = linear.map(linearChannelToSrgb) as [number, number, number]
  return rgbToHex(rgb)
}

/** WCAG relative luminance, used for contrast-ratio comparisons. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

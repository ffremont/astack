export type Picture = Partial<{
    id: string
    moonPhase: string
    weather: string
    instrument: string
    location: string
    type: string
    name: string
    camera: string
    corrRed: string
    tags: string[]
    webTags: string[]
    exposure: number
    gain: number
    dateObs: string
    stackCnt: number
    constellation: string
    novaAstrometryReportUrl: string
}>
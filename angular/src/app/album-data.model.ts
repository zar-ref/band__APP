// import {Album} from './album.model'

export interface AlbumData{
    albumId: number
    name: string
    path: string
    date: Date
    description: string
    imgUrl: string
    musicsUrls: string[]
    hasAccess: boolean
}
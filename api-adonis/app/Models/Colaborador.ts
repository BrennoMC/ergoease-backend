import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Colaborador extends BaseModel {
  @column({ isPrimary: true })
  public matricula: number

  @column()
  public nomeCompleto: string

  @column()
  public email: string

  @column()
  public senha: string

  @column()
  public departamento: string

  @column()
  public deletado: boolean

  @column.dateTime({ autoCreate: true })
  public criadoEm: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public atualizadoEm: DateTime
}

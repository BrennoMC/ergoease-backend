import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'colaboradores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('matricula')
      table.string('nome_completo')
      table.string('email')
      table.string('senha')
      table.string('departamento')
      table.boolean('deletado')
      table.timestamp('criado_em', { useTz: true })
      table.timestamp('atualizado_em', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

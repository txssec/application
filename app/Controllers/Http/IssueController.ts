import { Application } from 'App/Models'
import { ApiController } from 'App/Controllers/ApiController'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IssueController extends ApiController {
  public async index({ response, auth, pagination }: HttpContextContract) {
    const user = auth.user as Application

    const issues = await user
      .related('issues')
      .query()
      .whereIn('status', ['pendent', 'reproved'])
      .paginate(pagination.page, pagination.limit)

    return this.response(response).withCollection(issues.toJSON())
  }
}

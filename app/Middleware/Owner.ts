import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class Owner {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const application = ctx.auth.user

    if (!application) {
      throw new UnauthorizedException('Not found application in context')
    }

    await application.preload('roles')
    const isAuthorized = application.roles.find((role) => role.slug === 'admin')

    if (ctx.params.application_id) {
      if (!isAuthorized && application.id !== ctx.params.application_id) {
        throw new UnauthorizedException(
          'Application is not authorized to manage other application resources'
        )
      }
    } else if (ctx.params.id) {
      if (!isAuthorized && application.id !== ctx.params.id) {
        throw new UnauthorizedException('Application is not authorized to manage other application')
      }
    }

    await next()
  }
}

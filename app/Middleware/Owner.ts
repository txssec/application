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

    if (isAuthorized) {
      return next()
    }

    if (ctx.request.method() === 'PUT' && ctx.params) {
      const id = ctx.params.id

      if (id !== application.id) {
        throw new UnauthorizedException(
          'Application is not authorized to update resources of other application'
        )
      }

      return next()
    }

    await next()
  }
}

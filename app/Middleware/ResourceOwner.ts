import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class ResourceOwner {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const application = ctx.auth.user

    if (!application) {
      throw new UnauthorizedException('Not found application in context')
    }

    await application.preload('roles')
    const isAuthorized = application.roles.find((role) => role.slug === 'admin')

    const resourceName = ctx.route?.name?.split('.')[1] as any

    const resource = await application.related(resourceName).query().where('id', ctx.params.id)

    if (!isAuthorized && !resource) {
      throw new NotFoundException('Resource not found for this application')
    }

    await next()
  }
}

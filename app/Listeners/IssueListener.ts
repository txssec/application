import { DateTime } from 'luxon'
import { EventsList } from '@ioc:Adonis/Core/Event'

import Event from '@ioc:Adonis/Core/Event'

export default class IssueListener {
  public async approveApplication({ application }: EventsList['approve::application']) {
    if (application.status === 'approved') {
      return
    }

    const issues = await application
      .related('issues')
      .query()
      .whereIn('status', ['pendent', 'reproved'])

    console.log(issues.length)
    if (issues.length > 0) {
      return
    }

    application.merge({ status: 'approved' })
    await application.save()
  }

  public async resolveContact({ key, application, contact }: EventsList['new::contact']) {
    const emptyContact = await application
      .related('issues')
      .query()
      .where('key', 'EMPTY_CONTACT')
      .whereNull('deleted_at')
      .whereNull('approved_at')
      .whereIn('status', ['pendent', 'reproved'])
      .first()

    if (emptyContact) {
      emptyContact.merge({ status: 'approved', approvedAt: DateTime.fromJSDate(new Date()) })

      await emptyContact.save()
    }

    const query = () => {
      return application
        .related('issues')
        .query()
        .whereNull('deleted_at')
        .whereNull('approved_at')
        .whereIn('status', ['pendent', 'reproved'])
    }

    if (key) {
      query().where('key', key)
    }

    const issue = await query()
      .where('resource_type', contact.type)
      .where('application_id', contact.applicationId)
      .first()

    if (issue) {
      issue.merge({ status: 'answered' })

      await issue.save()
    }

    Event.emit('approve::application', { application })
  }

  public async resolveAddress({ application, address }: EventsList['new::address']) {
    const emptyContact = await application
      .related('issues')
      .query()
      .where('key', 'EMPTY_ADDRESS')
      .whereNull('deleted_at')
      .whereNull('approved_at')
      .whereIn('status', ['pendent', 'reproved'])
      .where('applicationId', address.applicationId)
      .first()

    if (emptyContact) {
      emptyContact.merge({ status: 'approved', approvedAt: DateTime.fromJSDate(new Date()) })

      await emptyContact.save()
    }

    Event.emit('approve::application', { application })
  }

  public async resolveAttachment({ key, application, attachment }: EventsList['new::attachment']) {
    const emptyAttachment = await application
      .related('issues')
      .query()
      .where('key', 'EMPTY_ATTACHMENT')
      .whereNull('deleted_at')
      .whereNull('approved_at')
      .whereIn('status', ['pendent', 'reproved'])
      .where('applicationId', attachment.applicationId)
      .first()

    if (emptyAttachment) {
      emptyAttachment.merge({ status: 'approved', approvedAt: DateTime.fromJSDate(new Date()) })

      await emptyAttachment.save()
    }

    const query = application
      .related('issues')
      .query()
      .whereNull('deleted_at')
      .whereNull('approved_at')
      .whereIn('status', ['pendent', 'reproved'])
      .where('applicationId', attachment.applicationId)

    if (key) {
      query.where('key', key)
    }

    const issues = await query

    issues.map((issue) => {
      if (issue.resourceType === attachment.type) {
        issue.merge({ status: 'answered' })

        issue.save()
      }
    })

    Event.emit('approve::application', { application })
  }
}

import { Issue } from 'App/Models'
import { EventsList } from '@ioc:Adonis/Core/Event'
import { DateTime } from 'luxon'

export default class IssueListener {
  public async resolveIssueContact({ key, contact }: EventsList['new::contact']) {
    const emptyContact = await Issue.query()
      .where('key', 'EMPTY_CONTACT')
      .whereNull('deleted_at')
      .whereNull('approved_at')
      .whereIn('status', ['pendent', 'reproved'])
      .where('application_id', contact.applicationId)
      .first()

    if (emptyContact) {
      emptyContact.merge({ status: 'approved', approvedAt: DateTime.fromJSDate(new Date()) })

      await emptyContact.save()
    }

    const query = () => {
      return Issue.query()
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
  }

  public async resolveIssueAddress({ address }: EventsList['new::address']) {
    const emptyContact = await Issue.query()
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
  }

  public async resolveIssueAttachment({ key, attachment }: EventsList['new::attachment']) {
    const emptyAttachment = await Issue.query()
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

    const query = Issue.query()
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
  }
}

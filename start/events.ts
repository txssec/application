import Event from '@ioc:Adonis/Core/Event'

Event.on('new::contact', 'IssueListener.resolveIssueContact')
Event.on('new::address', 'IssueListener.resolveIssueAddress')
Event.on('new::attachment', 'IssueListener.resolveIssueAttachment')

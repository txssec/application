import Event from '@ioc:Adonis/Core/Event'

Event.on('new::contact', 'IssueListener.resolveContact')
Event.on('new::address', 'IssueListener.resolveAddress')
Event.on('new::attachment', 'IssueListener.resolveAttachment')

Event.on('approve::application', 'IssueListener.approveApplication')

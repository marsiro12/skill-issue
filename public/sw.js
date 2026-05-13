self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Skill Issue', {
      body: data.body ?? '',
      icon: '/icon.svg',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      for (const client of list) {
        if (client.url.includes('/dashboard') && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow('/dashboard')
    })
  )
})

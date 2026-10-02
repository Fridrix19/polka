<script setup lang="ts">
import logo from '~/assets/logo.svg?url'
// оболочка админки: проверка входа, оглавление справа со счётчиками, быстрый поиск, обязательная смена пароля
const { api, me, can } = useAdm()
const route = useRoute()
const ready = ref(false)
const counts = ref<any>({})
const isLogin = computed(() => route.path === '/admin/login')
useHead({ title: 'Админка — Polka', link: [{ rel: 'icon', type: 'image/svg+xml', href: logo }] })

async function loadMe() {
  const r: any = await $fetch('/api/admin/auth/me').catch(() => ({ admin: null, perms: [] }))
  me.value = { admin: r.admin, perms: r.perms || [] }
  if (!r.admin && !isLogin.value) return navigateTo('/admin/login')
  if (r.admin && isLogin.value) return navigateTo('/admin')
}
async function loadCounts() { if (me.value.admin) counts.value = await api('GET', '/summary', undefined, { quiet: true }).catch(() => ({})) }
let cT: any
onUnmounted(() => clearInterval(cT))
onMounted(async () => { await loadMe(); ready.value = true; cT = setInterval(() => { if (!isLogin.value && document.visibilityState === 'visible') loadCounts() }, 30000); if (me.value.admin?.must_change) pw.open = true; else loadCounts() })
watch(() => route.path, () => { if (!isLogin.value) loadCounts() })

// оглавление: рубрики и разделы со сквозной нумерацией, счётчики очереди
const GROUPS = [
  { id: 'queue', label: 'Очередь', icon: 'pi-inbox', items: [
    { to: '/admin/orders', label: 'Заказы', perm: 'orders', n: () => (counts.value.orders_open || 0) + (counts.value.orders_need_info || 0) },
    { to: '/admin/kyc', label: 'Верификация', perm: 'kyc', n: () => counts.value.kyc_pending, warn: true },
    { to: '/admin/refunds', label: 'Возвраты', perm: 'refunds', n: () => counts.value.refunds_new, warn: true },
    { to: '/admin/chats', label: 'Чаты', perm: 'chats', n: () => counts.value.chats_waiting, warn: true },
  ] },
  { id: 'people', label: 'Клиенты', icon: 'pi-users', items: [
    { to: '/admin/users', label: 'Пользователи', perm: 'users' },
    { to: '/admin/reviews', label: 'Отзывы', perm: 'reviews' },
  ] },
  { id: 'shop', label: 'Витрина', icon: 'pi-box', items: [
    { to: '/admin/products', label: 'Товары и цены', perm: 'products' },
  ] },
  { id: 'data', label: 'Цифры', icon: 'pi-chart-line', items: [
    { to: '/admin', label: 'Сводка', perm: 'summary', exact: true },
    { to: '/admin/analytics', label: 'Аналитика', perm: 'analytics' },
    { to: '/admin/export', label: 'Выгрузки CSV', perm: 'export' },
  ] },
  { id: 'sys', label: 'Команда', icon: 'pi-shield', items: [
    { to: '/admin/admins', label: 'Админы', perm: 'admins' },
    { to: '/admin/settings', label: 'Настройки', perm: 'settings' },
    { to: '/admin/audit', label: 'Журнал действий', perm: 'audit' },
  ] },
]
const isOn = (i: any) => i.exact ? route.path === i.to : route.path.startsWith(i.to) && !(i.to === '/admin' && route.path !== '/admin')
const groups = computed(() => { let idx = 0; return GROUPS.map(g => {
  const items = g.items.filter(i => can(i.perm)).map(i => ({ ...i, idx: ++idx, count: i.n ? i.n() || 0 : 0 }))
  return { ...g, items, count: items.reduce((a, i) => a + (i.warn || g.id === 'queue' ? i.count : 0), 0), to: items[0]?.to }
}).filter(g => g.items.length) })
const todayStr = (() => { const t = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); return t.charAt(0).toUpperCase() + t.slice(1) })()
const search = ref('')
function go() {
  const v = search.value.trim(); if (!v) return
  const isOrder = /^pk-/i.test(v)
  navigateTo({ path: isOrder && can('orders') ? '/admin/orders' : '/admin/users', query: { q: v, ...(isOrder ? { status: 'all' } : {}) } })
  search.value = ''
}
async function logout() { await $fetch('/api/admin/auth/logout', { method: 'POST' }); me.value = { admin: null, perms: [] }; navigateTo('/admin/login') }
const pw = reactive({ open: false, old: '', new: '', busy: false })
async function changePw() {
  pw.busy = true
  try { await api('POST', '/auth/password', { old: pw.old, new: pw.new }); pw.open = false; pw.old = pw.new = ''; await loadMe(); loadCounts() } finally { pw.busy = false }
}
</script>

<template>
  <Toast position="top-right" />
  <ConfirmDialog />
  <NuxtPage v-if="isLogin" />
  <div v-else-if="ready && me.admin" class="pk">
    <header class="pk-top">
      <span class="pk-date">{{ todayStr }}</span>
      <NuxtLink to="/admin" class="pk-brand"><img :src="logo" alt=""><span>Polka</span><small>редакция</small></NuxtLink>
      <div class="pk-me">
        <form class="pk-search" role="search" @submit.prevent="go"><input v-model="search" placeholder="Номер PK-… или клиент" aria-label="Быстрый поиск"><button type="submit" aria-label="Найти"><i class="pi pi-search" /></button></form>
        <span class="pk-who"><b>{{ me.admin.name }}</b><span>{{ ROLE[me.admin.role] }}</span></span>
        <button type="button" class="pk-link" @click="pw.open = true">Пароль</button>
        <button type="button" class="pk-link" @click="logout">Выйти</button>
      </div>
    </header>
    <div class="pk-body">
      <main class="adm-main">
        <div v-if="me.admin.must_change" class="banner"><i class="pi pi-exclamation-triangle warn" />
          <span>Вы вошли с временным паролем{{ me.admin.login === 'admin' ? ' admin/admin' : '' }}. Смените его, прежде чем работать дальше.</span>
          <Button size="small" label="Сменить пароль" @click="pw.open = true" />
        </div>
        <NuxtPage v-if="!me.admin.must_change" @changed="loadCounts" />
      </main>
      <aside class="pk-toc" aria-label="Оглавление">
        <h2>Оглавление</h2>
        <section v-for="g in groups" :key="g.id" class="pk-sec">
          <h3>{{ g.label }}<b v-if="g.count" class="pk-sec-n">{{ g.count }}</b></h3>
          <NuxtLink v-for="i in g.items" :key="i.to" :to="i.to" :class="['pk-i', { on: isOn(i) }]">
            <span class="pk-num">{{ String(i.idx).padStart(2, '0') }}</span><span class="pk-l">{{ i.label }}</span><i class="pk-dots" /><span v-if="i.count" :class="['pk-c', { warn: i.warn }]">{{ i.count }}</span>
          </NuxtLink>
        </section>
      </aside>
    </div>
  </div>
  <Dialog v-model:visible="pw.open" modal header="Смена пароля" :style="{ width: 'min(420px, 94vw)' }">
    <div class="grid">
      <div class="field"><label>Текущий пароль</label><Password v-model="pw.old" :feedback="false" toggle-mask fluid /></div>
      <div class="field"><label>Новый пароль — от 10 символов, буквы и цифры</label><Password v-model="pw.new" toggle-mask fluid /></div>
    </div>
    <template #footer><Button label="Отмена" severity="secondary" text @click="pw.open = false" /><Button label="Сохранить" :loading="pw.busy" @click="changePw" /></template>
  </Dialog>
</template>

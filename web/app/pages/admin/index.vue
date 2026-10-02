<script setup lang="ts">
const { api } = useAdm()
const s = ref<any>(null)
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const period = ref({ from: iso(new Date(Date.now() - 29 * 86400000)), to: iso(new Date()) })
async function load() { s.value = await api('GET', '/summary?x=1' + periodQS(period.value)) }
watch(period, load, { deep: true }); onMounted(load)
const max = computed(() => Math.max(1, ...(s.value?.days || []).map((x: any) => (+x.sales_kop + +x.topups_kop))))
const fmtRange = computed(() => s.value ? `${d(s.value.period.from)} — ${d(s.value.period.to)}` : '')
const agenda = computed(() => s.value ? [
  { to: '/admin/orders', n: +s.value.orders_open + +(s.value.orders_need_info || 0), t: 'Заказы', h: s.value.orders_need_info ? `ждут данных: ${s.value.orders_need_info}` : 'оплачены, ждут выдачи' },
  { to: '/admin/kyc', n: +s.value.kyc_pending, t: 'Верификация', h: 'паспорта на проверке' },
  { to: '/admin/refunds', n: +s.value.refunds_new, t: 'Возвраты', h: 'новые заявки' },
  { to: '/admin/chats', n: +(s.value.chats_waiting || 0), t: 'Чаты', h: 'клиенты ждут ответа' },
] : [])
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
</script>
<template>
  <div v-if="s" class="ed">
    <header class="ed-head">
      <div><span class="ed-k">Сводка дня</span><h1>Что сегодня <em>в работе</em></h1></div>
      <div class="ed-rate"><span>Курс ЦБ</span><b>{{ s.rate }} ₽</b><span>за $1</span></div>
    </header>

    <section class="ed-agenda" aria-label="Очередь">
      <NuxtLink v-for="x in agenda" :key="x.to" :to="x.to" :class="['ed-a', { zero: !x.n }]">
        <span class="ed-an">{{ x.n }}</span><b>{{ x.t }}</b><span>{{ x.h }}</span><i>Открыть →</i>
      </NuxtLink>
    </section>

    <div class="ed-row">
      <section class="ed-ledger">
        <div class="ed-sh"><h2>Итоги периода</h2><AdmPeriod v-model="period" /></div>
        <p class="ed-range">{{ fmtRange }}</p>
        <dl>
          <div><dt>Продажи</dt><i /><dd>{{ kop(+s.period.sales_kop) }}</dd><small>{{ s.period.orders }} заказов · {{ s.period.buyers }} покупателей</small></div>
          <div><dt>Пополнения</dt><i /><dd>{{ kop(+s.period.topups_kop) }}</dd><small>возвраты {{ kop(+s.period.refunds_kop) }}</small></div>
          <div><dt>Новые клиенты</dt><i /><dd>{{ s.period.users_new }}</dd><small>прошли KYC: {{ s.period.kyc_approved }}</small></div>
          <div><dt>Посетители сайта</dt><i /><dd>{{ s.period.visitors }}</dd><small><NuxtLink to="/admin/analytics">подробнее в аналитике</NuxtLink></small></div>
        </dl>
      </section>
      <aside class="ed-bal">
        <span>На балансах клиентов</span>
        <b>{{ kop(+s.balances_kop) }}</b>
        <span>клиентов всего — {{ s.users_total }}</span>
        <NuxtLink to="/admin/users">К списку клиентов →</NuxtLink>
      </aside>
    </div>

    <div class="ed-row ed-row2">
      <section>
        <div class="ed-sh"><h2>По дням</h2><div class="legend"><span><i style="background:#1A1712" />продажи</span><span><i style="background:#D8431C" />пополнения</span></div></div>
        <div v-if="s.days.length" class="chart">
          <div v-for="x in s.days" :key="x.day" class="col" v-tooltip.top="`${d(x.day)}: продажи ${kop(+x.sales_kop)}, пополнения ${kop(+x.topups_kop)}`">
            <div class="bar t" :style="{ height: (x.topups_kop / max * 100) + 'px' }" />
            <div class="bar" :style="{ height: (x.sales_kop / max * 100) + 'px' }" />
            <span v-if="s.days.length <= 31" class="lbl">{{ x.day.slice(8) }}</span>
          </div>
        </div>
        <p v-else class="muted">Период больше 3 месяцев — график по дням не строим, смотрите итоги выше.</p>
      </section>
      <section>
        <div class="ed-sh"><h2>Что покупают</h2></div>
        <ol v-if="s.top.length" class="ed-top">
          <li v-for="(x, i) in s.top" :key="x.product_name"><span class="ed-ti">{{ ROMAN[i] || i + 1 }}</span><b>{{ x.product_name }}</b><i /><span class="ed-tv">{{ kop(+x.kop) }}<small>{{ x.n }} шт.</small></span></li>
        </ol>
        <p v-else class="muted">Заказов за период нет</p>
        <div v-if="s.low_keys.length" class="ed-keys"><h3>Заканчиваются ключи</h3>
          <p v-for="k in s.low_keys" :key="k.slug"><NuxtLink :to="'/admin/products/' + k.slug">{{ k.name }}</NuxtLink> — свободно {{ k.free }}</p></div>
      </section>
    </div>
  </div>
</template>

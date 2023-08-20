const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/IndexPage.vue')},
      {path: 'locator-dev', component: () => import('pages/LocatorDev.vue')},
      {path: 'locator-prod', component: () => import('pages/LocatorProd.vue')},
      {path: 'generator-data-patch', component: () => import('pages/GeneratorDataPatch.vue')},
      {path: 'generator-stream', component: () => import('pages/GeneratorStream.vue')},
      {path: 'convertor-uuid', component: () => import('pages/ConvertorUuid.vue')}
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

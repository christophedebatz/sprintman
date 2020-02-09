const productFields = [
  { frontName: 'product-name', apiName: 'name' },
  { frontName: 'product-description', apiName: 'description' },
  { frontName: 'product-price', apiName: 'price' },
  { frontName: 'product-picture-url', apiName: 'pictureUrl' },
  { frontName: 'product-quantity', apiName: 'availableQty' }
]
const couponFields = [
  { frontName: 'coupon-label', apiName: 'label' },
  { frontName: 'coupon-code', apiName: 'code' },
  { frontName: 'coupon-value', apiName: 'amount' }
]
const carrierFields = [
  { frontName: 'carrier-label', apiName: 'label' },
  { frontName: 'carrier-price', apiName: 'price' },
  { frontName: 'carrier-ref', apiName: 'reference' },
  { frontName: 'carrier-delay', apiName: 'delay' },
  { frontName: 'carrier-country', apiName: 'country'},
  { frontName: 'carrier-export-multiplier', apiName: 'multiplier'},
]

// possible types: integer, float, json
const buttonConfigsFields = [
  { frontName: 'oyst-button-configs', apiName: 'button_configs', type: 'json' }
]

const merchantFields = [
  { frontName: 'oyst-merchant', apiName: 'merchant', type: 'json' }
]

let defaultButtonConfigId = null

function wysiwygProductCard () {
  productFields.forEach(field => {
    const node = document.getElementById(field.frontName)
    if (node) {
      node.addEventListener('keyup', function () {
        const cardNode = document.getElementById(`card-${field.frontName}`)
        if (cardNode) {
          if (cardNode.nodeName.toLowerCase() === 'img') {
            cardNode.src = node.value
          } else {
            cardNode.innerText = node.value
          }
        }
      })
    }
  })
}

function fillProductForm (products = []) {
  if (products.length === 0) {
    window.alert('Be sure saving the product before enjoying Bunker ;-)')
    return
  }
  for (let product of products) {
    productFields.forEach(field => {
      if (typeof product[field.apiName] !== 'undefined') {
        // fill form fields value andthen adjust the card product preview
        document.getElementById(field.frontName).value = product[field.apiName]
        const cardNode = document.getElementById(`card-${field.frontName}`)
        if (cardNode) {
          if (cardNode.nodeName.toLowerCase() === 'img') {
            cardNode.src = product[field.apiName]
          } else {
            cardNode.innerText = product[field.apiName]
          }
        }
      }
    })
  }
}

//
// method must be one of those get, put, post, delete and patch
// the url must be an absolute path
// data must be an object (optional if get or delete method)
// headers must be provided as { name: 'Authorization', value: 'hello world' }, optional
//
function send (method, url, data = undefined, headers = []) {
  if (['put', 'post', 'get', 'delete', 'patch'].indexOf(method.toLowerCase()) === -1) {
    console.error('Wrong xhr method name.')
    return
  }
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (headers && headers.length > 0) {
      headers.forEach(function (header) {
        xhr.setRequestHeader(header.name, header.value)
      })
    }
    xhr.onload = function () {
      const responseText = xhr.responseText
      if (xhr.status >= 400) {
        return reject(new Error(responseText))
      }
      resolve(responseText ? JSON.parse(responseText) : responseText)
    }
    xhr.send(data ? JSON.stringify(data) : undefined)
  })
}

function doLoading (submitNode, state = 'starts') {
  if (state === 'starts') {
    submitNode.disabled = 'disabled'
  } else {
    const resetButton = function (styles, text) {
      setTimeout(function () {
        submitNode.style = JSON.parse(styles)
        submitNode.innerHTML = text
        submitNode.removeAttribute('disabled')
      }, 1000)
    }
    const styles = JSON.stringify(submitNode.style)
    const text = submitNode.innerHTML
    submitNode.style.color = 'white'
    if (state === 'success') {
      submitNode.style.backgroundColor = 'green'
      submitNode.innerHTML = 'Saved!'
      resetButton(styles, text)
    } else {
      submitNode.style.backgroundColor = '#8b0000'
      submitNode.innerHTML = 'PluginError, see console.'
      resetButton(styles, text)
    }
  }
}

function formatPayload (fields = []) {
  return new Promise(function (resolve, reject) {
    const body = {
      merchantId: MERCHANT_ID
    }
    fields.forEach(field => {
      const node = document.getElementById(field.frontName)
      if (node) {
        body[field.apiName] = node.value
      }
    })
    const usedValues = Object.values(body).filter(v => v !== undefined) || []
    if (usedValues.length >= fields.length) {
      return resolve(body)
    }
    reject('form-blank-values')
  })
}

async function fetchProduct (merchantId) {
  return send('get', `${BUNKER_API_URL}/merchants/${merchantId}/products`)
    .then(function (res) {
      if (res.payload) {
        return res.payload
      }
    })
    .catch(function (err) {
      console.error('fetchProduct error=', err)
    })
}

async function updateProduct (submitNode) {
  doLoading(submitNode)
  const body = await formatPayload(productFields)
  send('put', `${BUNKER_API_URL}/merchants/${body.merchantId}/products`, body)
    .then(function () {
      doLoading(submitNode, 'success')
    })
    .catch(function (err) {
      console.error('updateProduct error=', err)
      doLoading(submitNode, 'error')
    })
}

async function addCarrier (submitNode) {
  doLoading(submitNode)
  const body = await formatPayload(carrierFields)
  await send('post', `${BUNKER_API_URL}/merchants/${body.merchantId}/carriers`, body)
    .then(function () {
      doLoading(submitNode, 'success')
    })
    .catch(function (err) {
      console.error('addCarrier error=', err)
      doLoading(submitNode, 'error')
    })
}

async function addCoupon (submitNode) {
  doLoading(submitNode)
  const body = await formatPayload(couponFields)
  await send('post', `${BUNKER_API_URL}/merchants/${body.merchantId}/coupons`, body)
    .then(function () {
      doLoading(submitNode, 'success')
    })
    .catch(function (err) {
      console.error('addCoupon error=', err)
      doLoading(submitNode, 'error')
    })
}

async function fetchCoupons (anchorNode) {
  if (!anchorNode) {
    throw new Error('anchorNode is not available to contains coupons table.')
  }
  anchorNode.innerHTML = ''
  const { payload } = await send('get', `${BUNKER_API_URL}/merchants/${MERCHANT_ID}/coupons`)
  payload.forEach(coupon => {
    const tr = document.createElement('tr')
    const tdCode = document.createElement('td')
    const tdLabel = document.createElement('td')
    const tdValue = document.createElement('td')
    const tdAction = document.createElement('td')
    tdCode.appendChild(document.createTextNode(coupon.code))
    tdLabel.appendChild(document.createTextNode(coupon.label))
    tdValue.appendChild(document.createTextNode(coupon.amount))
    tdAction.innerHTML = `
        <button data-id="${coupon._id}" type="button" style="cursor:pointer;" class="btn-small btn-danger delete-coupon-submit">
          <i class="fas fa-trash-alt"></i>
        </button>`
    tr.appendChild(tdCode)
    tr.appendChild(tdLabel)
    tr.appendChild(tdValue)
    tr.appendChild(tdAction)
    anchorNode.appendChild(tr)
  })
  return payload
}

function getApiAuthHeaders (api = 'merchant-api', sharedKey = MERCHANT_API_SHARED_KEY) {
  const authorization = `Bearer ${KJUR.jws.JWS.sign(
    'HS256',
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    JSON.stringify({ api }),
    sharedKey
  )}`
  return [
    { name: 'Authorization', value: authorization }
  ]
}

async function updateButtonConfigs (buttonConfigId, merchantId) {
  let payload = {}
  buttonConfigsFields.forEach(function (field) {
    payload = editors[field.frontName].getValue()
    payload = JSON.stringify(JSON.parse(payload))
  })
  return send('put', `${MERCHANT_API_URL}/merchants/${merchantId}/button_configs/${buttonConfigId}`, payload, getApiAuthHeaders())
}

async function updateOystSettings (submitNode, merchantId) {
  try {
    await updateMerchant(merchantId)
    if (defaultButtonConfigId) {
      await updateButtonConfigs(defaultButtonConfigId, merchantId)
      doLoading(submitNode, 'success')
    } else {
      console.warn('Default button config id has previously not been fetched. Is merchant api up?')
      throw new Error('invalid-button-config-id')
    }
  } catch (e) {
    console.error('updateOystSettings=', e)
    doLoading(submitNode, 'error')
  }
}

function unset (object, properties = []) {
  properties.forEach(prop => {
    delete object[prop]
  })
}

async function fetchButtonConfigs (merchantId) {
  return send('get', `${MERCHANT_API_URL}/merchants/${merchantId}/button_configs`, undefined, getApiAuthHeaders())
    .then(function (res) {
      buttonConfigsFields.forEach(function (field) {
        const editor = editors[field.frontName]

        // set dynamically the default button config id to the first one
        if (res.button_configs[0].id) {
          defaultButtonConfigId = res.button_configs[0].id
        }
        unset(res.button_configs[0], ['id', 'merchant_id', 'one_click_config'])
        if (editor && field.type === 'json') {
          editor.setValue(JSON.stringify(res.button_configs[0], null, 2))
        } else {
          console.error(`No node found for id ${field.frontName}`)
        }
      })
    })
    .catch(function (err) {
        console.error('error while fetching button configs', err)
      }
    )
}

async function fetchMerchant (merchantId) {
  return send('get', `${MERCHANT_API_URL}/merchants/${merchantId}`, undefined, getApiAuthHeaders())
    .then(function (res) {
      merchantFields.forEach(function (field) {
        res.merchant.default_billing_parameters = res.merchant.billing_parameters
        unset(res.merchant,
          ['sav', 'id', 'created_at', 'deleted_at', 'updated_at', 'checked_at',
            'iban', 'is_validated', 'logo_url', 'website_domain', 'cgs_validation', 'bill_url',
            'id_front_url', 'id_back_url', 'rib_url', 'is_test', 'billing_parameters']
        )
        const editor = editors[field.frontName]
        if (editor && field.type === 'json') {
          editor.setValue(JSON.stringify(res.merchant, null, 2))
        } else {
          console.error(`No node found for id ${field.frontName}`)
        }
      })
    })
    .catch(function (err) {
        console.error('Error while fetching merchant', err)
      }
    )
}

async function deleteProducts (merchantId, submitNode) {
  try {
    doLoading(submitNode)
    await send('delete', `${BUNKER_API_URL}/merchants/${merchantId}/products`)
    doLoading(submitNode, 'success')
  } catch (e) {
    doLoading(submitNode, 'error')
  }
}

async function deleteOrders (submitNode) {
  try {
    doLoading(submitNode)
    await send('delete', `${PLUGIN_API_URL.external}/orders`)
    doLoading(submitNode, 'success')
  } catch (e) {
    doLoading(submitNode, 'error')
  }
}

async function updateMerchant (merchantId) {
  let payload = {}
  merchantFields.forEach(function (field) {
    payload = editors[field.frontName].getValue()
    payload = JSON.stringify(JSON.parse(payload))
  })
  return send('put', `${MERCHANT_API_URL}/merchants/${merchantId}`, payload, getApiAuthHeaders())
}

function getParameterByName (key) {
  const url = window.location.href
  const name = key.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return true
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

async function fetchCarriers (anchorNode) {
  if (!anchorNode) {
    throw new Error('anchorNode is not available to contains carriers table.')
  }
  anchorNode.innerHTML = ''
  const { payload } = await send('get', `${BUNKER_API_URL}/merchants/${MERCHANT_ID}/carriers`)
  payload.forEach(carrier => {
    const tr = document.createElement('tr')
    const tdLabel = document.createElement('td')
    const tdRef = document.createElement('td')
    const tdDelay = document.createElement('td')
    const tdPrice = document.createElement('td')
    const tdCountry = document.createElement('td')
    const tdMultiplier = document.createElement('td')
    const tdAction = document.createElement('td')
    tdLabel.appendChild(document.createTextNode(carrier.label))
    tdRef.appendChild(document.createTextNode(carrier.reference))
    tdDelay.appendChild(document.createTextNode(carrier.delay))
    tdPrice.appendChild(document.createTextNode(carrier.price))
    tdCountry.appendChild(document.createTextNode(carrier.country))
    tdMultiplier.appendChild(document.createTextNode(carrier.multiplier))
    tdAction.innerHTML = `
        <button data-id="${carrier._id}" type="button" style="cursor:pointer;" class="btn-small btn-danger delete-carrier-submit">
          <i class="fas fa-trash-alt"></i>
        </button>&nbsp;
        <button data-id="${carrier._id}" type="button" style="cursor:pointer;" 
          class="btn-small ${carrier.isPrimary ? 'btn-primary' : ''} primary-carrier-submit">
          <i class="${carrier.isPrimary ? 'fas' : 'far'} fa-check-circle"></i>
        </button>`
    tr.appendChild(tdRef)
    tr.appendChild(tdLabel)
    tr.appendChild(tdDelay)
    tr.appendChild(tdPrice)
    tr.appendChild(tdCountry)
    tr.appendChild(tdMultiplier)
    tr.appendChild(tdAction)
    anchorNode.appendChild(tr)
  })
  return payload
}

function addCouponActionsListener (callbackDelete) {
  Array.from(document.getElementsByClassName('delete-coupon-submit')).forEach(buttonNode => {
    buttonNode.addEventListener('click', async function () {
      callbackDelete(buttonNode)
    })
  })
}

function addCarrierActionsListener (callbackDelete, callbackSetPrimary) {
  Array.from(document.getElementsByClassName('delete-carrier-submit')).forEach(buttonNode => {
    buttonNode.addEventListener('click', async function () {
      callbackDelete(buttonNode)
    })
  })
  Array.from(document.getElementsByClassName('primary-carrier-submit')).forEach(buttonNode => {
    buttonNode.addEventListener('click', async function () {
      callbackSetPrimary(buttonNode)
    })
  })
}

async function updateBunker () {
  if (!io) {
    throw new Error('socket.io is not loaded.')
  }
  const socket = io()
  socket.on('bunker::ws::response', function (msg) {
    console.log('bunker response=', msg)
    if (msg && msg === 'hello') {
      console.log('connector to server ws://' + BUNKER_API_URL)
      socket.emit('bunker::ws::procedure', 'update-bunker')
    } else {
      console.log('message=', msg)
    }
  })
}

async function checkBunkerVersion (versionWarningNode) {
  const { payload } = await send('get', `${BUNKER_API_URL}/version`)
  // if (payload.isLast === false) {
    versionWarningNode.style.display = 'block'
  // }
}

// const eachLink = function (callback) {
//   Array.from(document.getElementsByClassName('nav-link')).forEach(link => {
//     link.innerHTML = callback(link)
//   })
// }

// function onWindowResize () {
//   const width = window.innerWidth
//   if (width < 1024) {
//     eachLink(function (link) {
//       return link.innerHTML.replace('settings', '').trim()
//     })
//   } else {
//     eachLink(function (link) {
//       return `${link.innerHTML.replace('settings', '').trim()} settings`
//     })
//   }
// }

function toggleDisplay (node, lsKey, reverse = false) {
  let value = localStorage.getItem(lsKey)
  if (reverse) {
    value = value.includes('on') ? 'off' : 'on'
  }
  if (value && value.includes('on')) {
    node.style.display = 'block'
  } else {
    node.style.display = 'none'
  }
}

function manageJumbotronDisplay (bunkerJumbotronCheckboxNode, navBarNode) {
  const value = localStorage.getItem('bunker:settings:jumbotron')
  if (!value) {
    localStorage.setItem('bunker:settings:jumbotron', 'on')
  }
  Array.from(document.getElementsByClassName('jumbotron')).forEach(jumbotronNode => {
    toggleDisplay(jumbotronNode, 'bunker:settings:jumbotron')
  })
  toggleDisplay(navBarNode, 'bunker:settings:jumbotron', true)
  bunkerJumbotronCheckboxNode.checked = ( localStorage.getItem('bunker:settings:jumbotron') || 'on' ).includes('on')
  bunkerJumbotronCheckboxNode.addEventListener('change', function () {
    localStorage.setItem('bunker:settings:jumbotron', bunkerJumbotronCheckboxNode.checked ? 'on' : 'off')
    toggleDisplay(navBarNode, 'bunker:settings:jumbotron', true)
    Array.from(document.getElementsByClassName('jumbotron')).forEach(jumbotronNode => {
      toggleDisplay(jumbotronNode, 'bunker:settings:jumbotron')
    })
  })
}

function manageBoobsDisplay (bunkerBoobsCheckboxNode) {
  bunkerBoobsCheckboxNode.checked = ( localStorage.getItem('bunker:settings:boobs') || 'off' ).includes('on')
  bunkerBoobsCheckboxNode.addEventListener('change', function () {
    localStorage.setItem('bunker:settings:boobs', bunkerBoobsCheckboxNode.checked ? 'on' : 'off')
  })
}

function doPreload (pluginFormAnchor, preloadNode, isStart = true) {
  if (pluginFormAnchor && preloadNode) {
    if (isStart) {
      pluginFormAnchor.style.display = 'none'
    } else {
      pluginFormAnchor.style.display = 'block'
      preloadNode.style.display = 'none'
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const couponAnchorNode = document.getElementById('coupon-table-anchor')
  const carrierAnchorNode = document.getElementById('carrier-table-anchor')

  const logoAnchor = document.getElementById('logo')
  const pluginFormAnchor = document.getElementById('form-plugin')
  const preloaderNode = document.getElementById('preload')

  const productSubmitNode = document.getElementById('product-submit')
  const couponSubmitNode = document.getElementById('coupon-submit')
  const carrierSubmitNode = document.getElementById('carrier-submit')
  const oystSubmitNode = document.getElementById('oyst-submit')
  const oystRedirect = document.getElementById('oyst-redirect')

  const couponsCounterNode = document.getElementById('coupons-counter')
  const carriersCounterNode = document.getElementById('carriers-counter')
  const deleteOrdersNode = document.getElementById('delete-orders')
  const deleteProductsNode = document.getElementById('delete-products')

  const bunkerBoobsCheckboxNode = document.getElementById('bunker-show-boobs')
  const versionWarningNode = document.getElementById('version-warning')
  const bunkerJumbotronCheckboxNode = document.getElementById('bunker-show-jumbotron')
  const navBarNode = document.getElementById('bunker-navbar')

  doPreload(pluginFormAnchor, preloaderNode)
  wysiwygProductCard()
  // await checkBunkerVersion(versionWarningNode)
  const products = await fetchProduct(MERCHANT_ID)
  fillProductForm(products)

  // remove button anchor if no stock
  // if (products && products.length > 0 && products[0].availableQty <= 0) {
  //   console.info('Product is out of stock. Please increase remaining items.')
  //   if (oystContainerAnchor) {
  //     console.info('Removing oyst-container...')
  //     let tries = 0
  //     const id = setInterval(function () {
  //       console.log('hello world')
  //       if (oystContainerAnchor) {
  //         oystContainerAnchor.remove()
  //         clearInterval(id)
  //       }
  //       if (tries > 10) {
  //         clearInterval(id)
  //       }
  //       tries++
  //     }, 80)
  //   }
  // }

  await fetchButtonConfigs(MERCHANT_ID)
  await fetchMerchant(MERCHANT_ID)
  const coupons = await fetchCoupons(couponAnchorNode)
  const carriers = await fetchCarriers(carrierAnchorNode)
  couponsCounterNode.innerHTML = coupons.length.toString()
  carriersCounterNode.innerHTML = carriers.length.toString()
  localStorage.getItem('bunker:oyst:redirect') === 'on' ? oystRedirect.setAttribute('checked', 'checked') : undefined

  const onRemoveCoupon = async function (buttonNode) {
    const couponId = buttonNode.getAttribute('data-id')
    await send('delete', `${BUNKER_API_URL}/coupons/${couponId}`)
    const coupons = await fetchCoupons(couponAnchorNode)
    couponsCounterNode.innerHTML = coupons.length.toString()
    addCouponActionsListener(onRemoveCoupon)
  }

  const onRemoveCarrier = async function (buttonNode) {
    const carrierId = buttonNode.getAttribute('data-id')
    await send('delete', `${BUNKER_API_URL}/carriers/${carrierId}`)
    const carriers = await fetchCarriers(carrierAnchorNode)
    carriersCounterNode.innerHTML = carriers.length.toString()
    addCarrierActionsListener(onRemoveCarrier)
  }

  const onSetPrimaryCarrier = async function (buttonNode) {
    const carrierId = buttonNode.getAttribute('data-id')
    await send('patch', `${BUNKER_API_URL}/carriers/${carrierId}`, { isPrimary: true })
    await fetchCarriers(carrierAnchorNode)
    addCarrierActionsListener(onRemoveCarrier, onSetPrimaryCarrier)
  }

  try {
    // window.onresize = onWindowResize
    productSubmitNode.addEventListener('click', async function () {
      await updateProduct(productSubmitNode)
    })

    logoAnchor.addEventListener('click', function () {
      document.body.scrollTop = 0
      $('#plugin-settings-tab').tab('show')
    })

    couponSubmitNode.addEventListener('click', async function () {
      await addCoupon(couponSubmitNode)
      const coupons = await fetchCoupons(couponAnchorNode)
      couponsCounterNode.innerHTML = coupons.length.toString()
      addCouponActionsListener(onRemoveCoupon)
    })

    carrierSubmitNode.addEventListener('click', async function () {
      await addCarrier(carrierSubmitNode)
      const carriers = await fetchCarriers(carrierAnchorNode)
      carriersCounterNode.innerHTML = carriers.length.toString()
      addCarrierActionsListener(onRemoveCarrier)
    })

    oystSubmitNode.addEventListener('click', async function () {
      await updateOystSettings(oystSubmitNode, MERCHANT_ID)
      localStorage.setItem('bunker:oyst:redirect', oystRedirect.checked ? 'on' : 'off')
    })

    deleteOrdersNode.addEventListener('click', async function () {
      await deleteOrders(deleteOrdersNode)
    })

    deleteProductsNode.addEventListener('click', async function () {
      await deleteProducts(MERCHANT_ID, deleteProductsNode)
    })

    manageBoobsDisplay(bunkerBoobsCheckboxNode)
    manageJumbotronDisplay(bunkerJumbotronCheckboxNode, navBarNode)

    addCouponActionsListener(onRemoveCoupon)
    addCarrierActionsListener(onRemoveCarrier, onSetPrimaryCarrier)

    $('#modal-update').on('shown.bs.modal', async function (e) {
      console.log('modal opened')
      await updateBunker()
    })

    doPreload(pluginFormAnchor, preloaderNode, false)
  } catch (e) {
    console.error('An error occurred: ', e)
  }
})

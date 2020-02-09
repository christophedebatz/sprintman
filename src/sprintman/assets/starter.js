/**
 * Manager loader and loading text while dev env is starting
 * @author Christophe de Batz <chris@oyst.com>
 */

function loadSuperTagScript (merchantId, loadingNodeId) {
  const startTime = new Date().getTime()
  const loadingNode = document.getElementById(loadingNodeId)
  const tryCreateScript = function () {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.src = `${BUNKER_CDN_URL}/super-tag.js?omid=${merchantId}`
    head.appendChild(script)
    return script
  }
  return new Promise(function (resolve) {
    showTexts(loadingNode)
    const script = tryCreateScript()
    script.onload = function () {
      return resolve(loadingNode)
    }
    const errorCallback = function () {
      script.remove()
      const id = setInterval(function () {
        if (new Date().getTime() - startTime > 2000) {
          clearInterval(id)
          window.location.replace(window.location)
        }
      }, 50)
    }
    script.onerror = errorCallback
    script.onabort = errorCallback
  })
}

function showTexts (node) {
  const texts = [
    'Initializing your environment...',
    'The future is on the way and will soon appear.',
    'You waited 4 months, you can wait 10 seconds.',
    'Chris is a magician and will reveal your environment!',
    'Babe, just attach your belt, it will happen soon...'
  ]
  const display = function (node, text) {
    node.innerHTML = `<h2 style="color: #180729; font-family: 'Trebuchet MS', 'verdana', serif;">${text}</h2>`
  }
  let textNode = document.createElement('span')
  textNode.style.textAlign = 'center'
  textNode.style.paddingTop = '70px'
  textNode.id = 'loader-text'
  node.parentNode.insertBefore(textNode, node.nextSibling)

  let i = 0
  display(textNode, texts[i])
  const textId = setInterval(function () {
    if (++i === texts.length - 1) {
      display(textNode, texts[texts.length - 1])
      clearInterval(textId)
    } else {
      display(textNode, texts[i])
    }
  }, 4000)
  return { textId, textNode }
}

function finalize (loadingNode) {
  const tagId = setInterval(function () {
    if (window.__OYST__.superTagEventEmitter) {
      clearInterval(tagId)
      const id = setInterval(function () {
        const shouldDisplayBoobs = localStorage.getItem('bunker:settings:boobs')
        if (shouldDisplayBoobs && shouldDisplayBoobs.includes('on')) {
          displayBoobs()
        }
        loadingNode.style.display = 'none'
        loadingNode.parentNode.removeChild(document.getElementById('loader-text'))
        clearInterval(id)
        document.getElementById('main').style.display = 'block'
        document.getElementById('footer').style.display = 'block'
        // set some overriden attributes to button's wrapper
        // !important and ";" will be added automatically
        const wrapper = document.querySelector('.oyst-button')
        if (wrapper) {
          const wrapperAttrs = [
            wrapper.getAttribute('style'),
            'position: relative',
            'right: 0px',
            'top: 0px'
          ]
          wrapper.setAttribute('style', wrapperAttrs.map(attr => attr.replace('!important', '')).join('!important;'))
        } else {
          console.error('Unable to update button\'s wrapper css attributes')
        }
      }, 50)
    }
  }, 50)
}


function displayBoobs () {
  console.log(`
    ?.$$$$$"     \`L         ;;;;;;;,          .\`.\`.\`.\`$;??h,_        \`h
     ?$$$$$       ""'       \`;;;;;;;;,         \`.\`.\`.\`.hJ"  \`"??cc,    $
 ?"???"??"          j'       :;;;;;;;;;;,       .\`.\`.\`.\`$               $
 ;;,                 $        :;;;;;;;;;;;,      \`.\`.\`.\`.$c,,__          $
 i;;,                 h         \`':;;;;;;;;;,      \`.\`.\`.\`h    \`"         ?c
 \`$;;;;,              $r           \`:;;;;;;;;,      .\`.\`.\`.$
   J$i;;h             $;             \`:;;;;;;;,      \`.\`.\`.\`$""=,
 .$$$$h;,            ,C;       .j???c, \`;t;;;;,        \`.\`.\`.?c
 $$$$$$h;,           $;,       J;;;;i;L. :?);;,           .\`.\`.?h,_
 $$$$$$$;           j';        $;;;$h9;L \`:?);;,                ,C?h.
 ?$$$$$$;           $;,        \`$;?ii$;;h \`;L;;,                (C;;?h
  3$$$$?;          J?;,         \`h;;;;;;P  :;L;,                \`$;;$?L
 .$$$$;;'         ,C;;,           \`?CjjF   \`;3;,                 $;;?h$
 $$$$;;:          $;;;,                    \`;3;                  \`h;;;F
 $$$?;;        \`.JF;;;,                     ;3;                   \`hiF    J"
 $$?;'     .\`.\`.c$h;;;;,                   ;;f;,                 ,;iF   z" z
 C;;       .\`.\`JCCC$;;;;;                 ;;$;;;; \`;i;,         ;;J"   J' J'
 ;;      .\`.\` JF;;??$hi;;;;.            .;;$;;;;;, ;?$;;;,    ,;;i$   J'.P
 '      \`.\`. ,C;;;;,  \`"h;;;;;;;;;;;;;;;i$?;;;;;;;, :;?h;;;;;;;;9"?. j','
       .\`.\` .$;;;;'       "??iijjjjii?""\`.\`;;;;;;;,  \`;;?h;;;;iP   $,'.P
      \`.\`. ,C;;;,                             \`;;;;,  \`;;;J""'     \`h $
     .\`.  ,C;;;;'                               ;;,    ;;;9         $$
    \`.\`  ,C;;;;f                                \`;;,   \`;;J  r      \`L
   .\`   z$;;;;,                                 \`;,     ;;9  $       h
       j"\`h;;;'                                 \`;,     ;;$  \`r      3
      j' ,c;;,                                   ;,     ;;$   $      \`h
     .P <$;;,                                   \`;,    .;;$.  ?.      $
        _______                  _____     _____              ______
        __  __ \\_____  ____________  /_    __  /______ __________  /_
       _  / / /__  / / /__  ___/_  __/    _  __/_  _ \\_  ___/__  __ \\
       / /_/ / _  /_/ / _(__  ) / /_      / /_  /  __// /__  _  / / /
       \\____/  _\\__, /  /____/  \\__/      \\__/  \\___/ \\___/  /_/ /_/
               /____/`)
}
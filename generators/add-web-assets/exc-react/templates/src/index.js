/*<% if (false) { %>
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
<% } %>
* <license header>
*/

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import runtime, {init} from '@adobe/exc-app'
import page from '@exc/runtime/page'
import topbar from '@exc/runtime/topbar'
import loadExcRuntime from './exc-runtime'

/* Here you can bootstrap your application and configure the integration with the Adobe Experience Cloud Shell */
let inExc = false
try {
  // throws if not running in exc
  loadExcRuntime(document, window)
  inExc = true
} catch (e) {
  console.log('application not running in Adobe Experience Cloud Shell')
  // fallback, not in exc run the UI without the shell
  bootstrapRaw()
}

if (inExc) {
  // this bootstraps when the exc Experience Cloud Shell is ready.
  init(() => bootstrapInExcShell())
}

function bootstrapRaw () {
  /* **here you can mock the ims objects** */
  const ims = {}

  // render the actual react application and pass along the ims object to make it available to the App
  ReactDOM.render(<App ims={ ims }/>, document.getElementById('root'))
}

function bootstrapInExcShell () {
  // Takes over 100% the the screen, including the topbar
  // page.viewportTakeover = true

  // set the app name to the Shell header
  topbar.customEnvLabel = '<%= projectName %>'

  // use this to set a favicon
  // page.favicon = 'url-to-favicon'

  // use this to respond to clicks on the app-bar title
  // topbar.onHeroClick(() => window.alert('Did I ever tell you you\'re my hero?'))

  // ready event brings in authentication/user info
  runtime().on('ready', ({ imsOrg, imsToken, imsProfile, locale }) => {
    console.log('Ready! received imsProfile:', imsProfile)
    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken
    }
    // render the actual react application and pass along the runtime and ims objects to make it available to the App
    ReactDOM.render(<App ims={ ims }/>, document.getElementById('root'))
  })

  // respond to history change events
  runtime().on('history', ({path}) => {
    console.log('history changed :: ', path)
    // this.history.replace(path)
    // this.setState({currentPath: `/${path}`})
  })

  // set solution info, shortTitle is used when window is too small to display full title
  topbar.solution = {
    icon: 'AdobeExperienceCloud',
    title: '<%= projectName %>',
    shortTitle: 'JGR'
  }
  page.title = '<%= projectName %>'

  // tell the exc-runtime object we are done
  page.done()
}

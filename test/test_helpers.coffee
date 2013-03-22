window.TestHelpers = {}

TestHelpers.buildPicaApplication = ->
  new Pica.Application(
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
    projectId: 5,
    map: map
  )

define [
  "sinon"
  "chai"
  "sinonChai"
  "mocha"
  "specHelpers"
], (sinon, chai, sinonChai, mocha, testHelpers) ->
  'use strict'

  should = chai.should()

  describe 'Pica.Application', ->
  
    describe '.createWorkspace', ->
      pica = magpieServer = null
  
      before ->
        magpieServer = new testHelpers.FakeMagpieServer()
        pica = testHelpers.buildPicaApplication()
  
        pica.newWorkspace()
  
      after ->
        magpieServer.server.restore()
  
      it 'creates a new workspace at .currentWorkspace', ->
        if pica.currentWorkspace.constructor.name?
          pica.currentWorkspace.constructor.name.should.equal 'PicaModelsWorkspace'
        else
          # Do a more naive tests in IE, because it's rubbish
          pica.currentWorkspace.should.not.equal "null"
  
      it 'gives the new workspace a references to itself in .currentWorkspace.app', ->
        pica.currentWorkspace.app.should.equal pica
  
  
    describe '.notifySyncStarted', ->
      describe 'called with no syncsInProgress', ->
        pica = syncStartedListener = null
        before ->
          magpieServer = new testHelpers.FakeMagpieServer()
          pica = testHelpers.buildPicaApplication()
  
          syncStartedListener = sinon.spy()
          pica.on('syncStarted', syncStartedListener)
  
          pica.notifySyncStarted()
  
        it 'fires the syncStarted event', ->
          syncStartedListener.calledOnce.should.be.ok
  
        it 'increments syncsInProgress', ->
          pica.syncsInProgress.should.equal 1
  
      describe 'when syncsInProgress > 0 and it is called', ->
        pica = syncStartedListener = null
        before ->
          magpieServer = new testHelpers.FakeMagpieServer()
          pica = testHelpers.buildPicaApplication()
          pica.syncsInProgress = 1
  
          syncStartedListener = sinon.spy()
          pica.on('syncStarted', syncStartedListener)
  
          pica.notifySyncStarted()
  
        it 'does not fire the syncStarted again', ->
          syncStartedListener.calledOnce.should.to.be.ok
  
        it 'increments syncsInProgress', ->
          pica.syncsInProgress.should.equal 2
  
    describe '.notifySyncFinished', ->
      describe 'called when 1 syncsInProgress', ->
        pica = syncFinishedListener = null
        before ->
          magpieServer = new testHelpers.FakeMagpieServer()
          pica = testHelpers.buildPicaApplication()
          pica.syncsInProgress = 1
  
          syncFinishedListener = sinon.spy()
          pica.on('syncFinished', syncFinishedListener)
  
          pica.notifySyncFinished()
  
        it 'decrements syncsInProgress', ->
          pica.syncsInProgress.should.equal 0
  
        it 'fires the syncFinished event', ->
          syncFinishedListener.calledOnce.should.be.ok
  
      describe 'called when 2 syncsInProgress', ->
        pica = syncFinishedListener = null
        before ->
          magpieServer = new testHelpers.FakeMagpieServer()
          pica = testHelpers.buildPicaApplication()
          pica.syncsInProgress = 2
  
          syncFinishedListener = sinon.spy()
          pica.on('syncFinished', syncFinishedListener)
  
          pica.notifySyncFinished()
  
        it 'decrements syncsInProgress', ->
          pica.syncsInProgress.should.equal 1
  
        it 'does not fire the syncFinished event', ->
          syncFinishedListener.calledOnce.should.not.be.ok
  
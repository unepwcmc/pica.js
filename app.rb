require 'sinatra/assetpack'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'app/js'
    serve '/css',    from: 'app/css'       # Optional
    serve '/images', from: 'app/images'    # Optional
  }
end

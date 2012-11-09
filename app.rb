require 'sinatra/assetpack'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'app/js'
    serve '/lib',    from: 'app/lib'       # Optional
    serve '/images', from: 'app/images'    # Optional
  }

  get '/' do
    puts ""
    File.read(File.join('app', 'index.html'))
  end
end

require 'sinatra/assetpack'
require 'json'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'app/js'
    serve '/lib',    from: 'app/lib'       # Optional
    serve '/images', from: 'app/images'    # Optional
  }

  get '/' do
    File.read(File.join('app', 'index.html'))
  end

  post '/polygon' do
    # TODO Actually store the polygon somewhere
    @json = JSON.parse(request.body.read)
    @json['id'] = 5
    @json['analysis_id'] = 1

    @json.to_json
  end

  get '/polygon/:id/calculated_layer_stats' do
    # TODO Return calculated stats for the given polygon
    [
      {name: 'Carbon', value: 5},
      {name: 'Forest', value: 8}
    ].to_json
  end
end

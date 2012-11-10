require 'sinatra/assetpack'
require 'json'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'app/js'
    serve '/lib',    from: 'app/lib'
    serve '/css',    from: 'app/css'
    serve '/img',    from: 'app/img'
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

  post '/polygon/:id/calculated_layer_stats' do
    # TODO Return calculated stats for the given polygon
    @geo_json = JSON.parse(request.body.read)
    puts @geo_json
    [
      {name: 'Carbon', value: 5},
      {name: 'Forest', value: 8}
    ].to_json
  end
end

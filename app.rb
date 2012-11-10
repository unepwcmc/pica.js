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

    @request_json = @geo_json['polygonGeoJSON']['geometry']
    puts @request_json
    response = HTTParty.get("http://46.51.133.104:8080/carbon/?polygon=#{URI.encode @request_json.to_json.to_s}")

    @request_body = {
      :polygon => @geo_json['polygonGeoJSON']
    }
    #response = HTTParty.post("http://46.51.133.104:8080/carbon/", {polygon: @geo_json['polygonGeoJSON']})

    @response_json = JSON.parse(response.body)

    [
      {name: "Carbon Count (#{@response_json['elapsed']}ms)", value: @response_json['carbon_count'],},
    ].to_json
  end
end

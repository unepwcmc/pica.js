
define [], ->

  data = {}

  data.FAKE_POLYGON_RESPONSE = {
    "id":98,
    "area_of_interest_id":5,
    "geometry":{
      "type":"Polygon",
      "coordinates":[
        [
          [
            53.63250732421874,
            24.599577462003484
          ],
          [
            53.69293212890625,
            24.12920858513251
          ],
          [
            54.3878173828125,
            24.241955877694206
          ],
          [
            54.2779541015625,
            24.80169495167004
          ],
          [
            53.63250732421874,
            24.599577462003484
          ]
        ]
      ]
    }
  }
  
  data.FAKE_PROJECT_INDEX_RESPONSE = {
    "id":5,
    "name":"my_polygon",
    "layers":[
      {
        "id":1,
        "display_name":"Protected Areas",
        "tile_url":"http://184.73.201.235/blue/{z}/{x}/{y}",
        "is_displayed":true
      }
    ]
  }

  data
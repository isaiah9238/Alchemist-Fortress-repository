export interface SPCS2011Zone {
  zoneName: string;
  fipsCode: string;
  epsgMeters: number;
  proj4Meters: string;     
  epsgSurveyFeet: number;
  proj4SurveyFeet: string; 
  projType: 'LCC' | 'TM' | 'OM';
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

export interface StateData {
  stateName: string;
  stateCode: string;
  zones: SPCS2011Zone[];
}

export const spcs2011Data: StateData[] = [
  {
    stateName: 'Alabama',
    stateCode: 'AL',
    zones: [
      { 
        zoneName: 'East', 
        fipsCode: '0101', 
        epsgMeters: 6355, 
        proj4Meters: '+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 9748, 
        proj4SurveyFeet: '+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 30.1, maxLat: 35.0, minLon: -86.7, maxLon: -84.8 }
      },
      { 
        zoneName: 'West', 
        fipsCode: '0102', 
        epsgMeters: 6356, 
        proj4Meters: '+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', 
        epsgSurveyFeet: 9749, 
        proj4SurveyFeet: '+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', 
        projType: 'TM',
        bounds: { minLat: 29.9, maxLat: 35.0, minLon: -88.5, maxLon: -86.5 }
      },
    ],
  },
  {
    stateName: 'Alaska',
    stateCode: 'AK',
    zones: [
      {
        zoneName: 'Zone 1',
        fipsCode: '5001',
        epsgMeters: 6394,
        proj4Meters: '+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102445,
        proj4SurveyFeet: '+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=16404166.6666667 +y_0=-16404166.6666667 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'OM',
        bounds: { minLat: 55.5, maxLat: 61.0, minLon: -139.0, maxLon: -130.0 }
      },
      {
        zoneName: 'Zone 2',
        fipsCode: '5002',
        epsgMeters: 6395,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102446,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 56.0, maxLat: 62.5, minLon: -144.0, maxLon: -140.0 }
      },
      {
        zoneName: 'Zone 3',
        fipsCode: '5003',
        epsgMeters: 6396,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102447,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 56.0, maxLat: 64.0, minLon: -148.0, maxLon: -144.0 }
      },
      {
        zoneName: 'Zone 4',
        fipsCode: '5004',
        epsgMeters: 6397,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102392,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 56.0, maxLat: 67.0, minLon: -152.0, maxLon: -148.0 }
      },
      {
        zoneName: 'Zone 5',
        fipsCode: '5005',
        epsgMeters: 6398,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102393,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 55.0, maxLat: 69.0, minLon: -156.0, maxLon: -152.0 }
      },
      {
        zoneName: 'Zone 6',
        fipsCode: '5006',
        epsgMeters: 6399,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102394,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 45.3, maxLat: 48.2, minLon: -90.4, maxLon: -83.3 }
      },
      {
        zoneName: 'Zone 7',
        fipsCode: '5007',
        epsgMeters: 6400,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102395,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 53.0, maxLat: 71.0, minLon: -164.0, maxLon: -160.0 }
      },
      {
        zoneName: 'Zone 8',
        fipsCode: '5008',
        epsgMeters: 6401,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.99996 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102396,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.99996 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 52.0, maxLat: 72.0, minLon: -168.0, maxLon: -164.0 }
      },
      {
        zoneName: 'Zone 9',
        fipsCode: '5009',
        epsgMeters: 6402,
        proj4Meters: '+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102397,
        proj4SurveyFeet: '+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 51.0, maxLat: 55.0, minLon: -172.0, maxLon: -168.0 }
      },
      {
        zoneName: 'Zone 10',
        fipsCode: '5010',
        epsgMeters: 6403,
        proj4Meters: '+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=51.8333333333333 +lat_2=53.8333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 102398, 
        proj4SurveyFeet: '+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=51.8333333333333 +lat_2=53.8333333333333 +x_0=3280833.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs',
        projType: 'LCC',
        bounds: { minLat: 51.0, maxLat: 53.0, minLon: -179.2, maxLon: 178.5 }
      },
    ],
  },
  {
    stateName: 'Arizona',
    stateCode: 'AZ',
    zones: [
      {
        zoneName: 'East',
        fipsCode: '0201',
        epsgMeters: 6406,
        proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 6407,
        proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +units=ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 31.3, maxLat: 37.0, minLon: -111.0, maxLon: -109.0 }
      },
      {
        zoneName: 'Central',
        fipsCode: '0202',
        epsgMeters: 6404,
        proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 6405,
        proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +units=ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 31.3, maxLat: 37.0, minLon: -113.2, maxLon: -110.8 }
      },
      {
        zoneName: 'West',
        fipsCode: '0203',
        epsgMeters: 6408,
        proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs',
        epsgSurveyFeet: 6409,
        proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=700000 +y_0=0 +ellps=GRS80 +units=ft +no_defs',
        projType: 'TM',
        bounds: { minLat: 31.3, maxLat: 37.0, minLon: -114.8, maxLon: -112.7 }
      },
    ],
  },
  {
    stateName: 'Arkansas',
    stateCode: 'AR',
    zones: [
      { zoneName: 'North', fipsCode: '0301', epsgMeters: 6411, proj4Meters: '+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.1333333333333 +lat_2=34.9666666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6412, proj4SurveyFeet: '+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.1333333333333 +lat_2=34.9666666666667 +x_0=1312333.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 34.7, maxLat: 36.5, minLon: -94.6, maxLon: -89.6 } },
      { zoneName: 'South', fipsCode: '0302', epsgMeters: 6413, proj4Meters: '+proj=lcc +lat_0=32.8333333333333 +lon_0=-92 +lat_1=34.3 +lat_2=33.1666666666667 +x_0=400000 +y_0=300000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6414, proj4SurveyFeet: '+proj=lcc +lat_0=32.8333333333333 +lon_0=-92 +lat_1=34.3 +lat_2=33.1666666666667 +x_0=1312333.33333333 +y_0=984250 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 33.0, maxLat: 34.6, minLon: -94.6, maxLon: -89.6 } }
    ]
  },
  {
      stateName: 'California',
      stateCode: 'CA',
      zones: [
        { zoneName: 'Zone 1', fipsCode: '0401', epsgMeters: 6415, proj4Meters: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.5 +lat_2=39.8333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6416, proj4SurveyFeet: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.5 +lat_2=39.8333333333333 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 39.5, maxLat: 42.0, minLon: -124.5, maxLon: -120.0 } },
        { zoneName: 'Zone 2', fipsCode: '0402', epsgMeters: 6417, proj4Meters: '+proj=lcc +lat_0=37.6666666666667 +lon_0=-120.5 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6418, proj4SurveyFeet: '+proj=lcc +lat_0=37.6666666666667 +lon_0=-120.5 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.0, maxLat: 40.5, minLon: -124.4, maxLon: -119.0 } },
        { zoneName: 'Zone 3', fipsCode: '0403', epsgMeters: 6419, proj4Meters: '+proj=lcc +lat_0=36.5 +lon_0=-119 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6420, proj4SurveyFeet: '+proj=lcc +lat_0=36.5 +lon_0=-119 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 36.7, maxLat: 38.7, minLon: -122.3, maxLon: -118.0 } },
        { zoneName: 'Zone 4', fipsCode: '0404', epsgMeters: 6421, proj4Meters: '+proj=lcc +lat_0=35.2 +lon_0=-118 +lat_1=36.7666666666667 +lat_2=35.4666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6422, proj4SurveyFeet: '+proj=lcc +lat_0=35.2 +lon_0=-118 +lat_1=36.7666666666667 +lat_2=35.4666666666667 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 35.1, maxLat: 37.0, minLon: -121.0, maxLon: -116.0 } },
        { zoneName: 'Zone 5', fipsCode: '0405', epsgMeters: 6423, proj4Meters: '+proj=lcc +lat_0=33.5 +lon_0=-116.25 +lat_1=35.4666666666667 +lat_2=33.8833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6424, proj4SurveyFeet: '+proj=lcc +lat_0=33.5 +lon_0=-116.25 +lat_1=35.4666666666667 +lat_2=33.8833333333333 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 33.5, maxLat: 35.8, minLon: -120.5, maxLon: -114.5 } },
        { zoneName: 'Zone 6', fipsCode: '0406', epsgMeters: 6425, proj4Meters: '+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.15 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6426, proj4SurveyFeet: '+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.15 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=6561666.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 32.5, maxLat: 34.2, minLon: -118.0, maxLon: -114.5 } }
      ]
  },
  {
      stateName: 'Colorado',
      stateCode: 'CO',
      zones: [
        { zoneName: 'North', fipsCode: '0501', epsgMeters: 6427, proj4Meters: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914400 +y_0=304800 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6428, proj4SurveyFeet: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=3000000 +y_0=1000000 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 39.5, maxLat: 41.0, minLon: -109.1, maxLon: -102.0 } },
        { zoneName: 'Central', fipsCode: '0502', epsgMeters: 6429, proj4Meters: '+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.45 +lat_2=38.2166666666667 +x_0=914400 +y_0=304800 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6430, proj4SurveyFeet: '+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.45 +lat_2=38.2166666666667 +x_0=3000000 +y_0=1000000 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.0, maxLat: 39.7, minLon: -109.1, maxLon: -102.0 } },
        { zoneName: 'South', fipsCode: '0503', epsgMeters: 6431, proj4Meters: '+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.1166666666667 +lat_2=37.05 +x_0=914400 +y_0=304800 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6432, proj4SurveyFeet: '+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.1166666666667 +lat_2=37.05 +x_0=3000000 +y_0=1000000 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 36.9, maxLat: 38.4, minLon: -109.1, maxLon: -102.0 } }
      ]
  },
  {
      stateName: 'Connecticut',
      stateCode: 'CT',
      zones: [
          { zoneName: 'Single Zone', fipsCode: '0600', epsgMeters: 6433, proj4Meters: '+proj=lcc +lat_0=40.8333333333333 +lon_0=-72.75 +lat_1=41.8333333333333 +lat_2=41.2 +x_0=300000 +y_0=150000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6434, proj4SurveyFeet: '+proj=lcc +lat_0=40.8333333333333 +lon_0=-72.75 +lat_1=41.8333333333333 +lat_2=41.2 +x_0=984250 +y_0=492125 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.9, maxLat: 42.1, minLon: -73.8, maxLon: -71.7 } }
      ]
  },
  {
      stateName: 'Delaware',
      stateCode: 'DE',
      zones: [
          { zoneName: 'Single Zone', fipsCode: '0700', epsgMeters: 6435, proj4Meters: '+proj=tmerc +lat_0=38 +lon_0=-75.4166666666667 +k=0.999995 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6436, proj4SurveyFeet: '+proj=tmerc +lat_0=38 +lon_0=-75.4166666666667 +k=0.999995 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 38.4, maxLat: 39.9, minLon: -75.8, maxLon: -75.0 } }
      ]
  },
  {
      stateName: 'Florida',
      stateCode: 'FL',
      zones: [
          { zoneName: 'East', fipsCode: '0901', epsgMeters: 6437, proj4Meters: '+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6438, proj4SurveyFeet: '+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 24.4, maxLat: 30.8, minLon: -81.7, maxLon: -80.0 } },
          { zoneName: 'West', fipsCode: '0902', epsgMeters: 6439, proj4Meters: '+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6440, proj4SurveyFeet: '+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 24.4, maxLat: 31.0, minLon: -83.0, maxLon: -81.0 } },
          { zoneName: 'North', fipsCode: '0903', epsgMeters: 6441, proj4Meters: '+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6442, proj4SurveyFeet: '+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 29.3, maxLat: 31.0, minLon: -87.6, maxLon: -81.6 } }
      ]
  },
  {
    stateName: 'Georgia',
    stateCode: 'GA',
    zones: [
      { zoneName: 'East', fipsCode: '1001', epsgMeters: 6443, proj4Meters: '+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6444, proj4SurveyFeet: '+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 30.3, maxLat: 35.0, minLon: -83.0, maxLon: -80.7 } },
      { zoneName: 'West', fipsCode: '1002', epsgMeters: 6445, proj4Meters: '+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6446, proj4SurveyFeet: '+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.99995 +x_0=2296583.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 30.3, maxLat: 35.0, minLon: -85.6, maxLon: -83.0 } }
    ]
  },
  {
    stateName: 'Hawaii',
    stateCode: 'HI',
    zones: [
      { zoneName: 'Zone 1', fipsCode: '5101', epsgMeters: 6447, proj4Meters: '+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.999966667 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6448, proj4SurveyFeet: '+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.999966667 +x_0=164041.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 21.8, maxLat: 22.3, minLon: -159.8, maxLon: -159.2 } },
      { zoneName: 'Zone 2', fipsCode: '5102', epsgMeters: 6449, proj4Meters: '+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.999966667 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6450, proj4SurveyFeet: '+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.999966667 +x_0=164041.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 21.2, maxLat: 21.8, minLon: -158.3, maxLon: -157.6 } },
      { zoneName: 'Zone 3', fipsCode: '5103', epsgMeters: 6451, proj4Meters: '+proj=tmerc +lat_0=20.6666666666667 +lon_0=-156.833333333333 +k=0.999966667 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6452, proj4SurveyFeet: '+proj=tmerc +lat_0=20.6666666666667 +lon_0=-156.833333333333 +k=0.999966667 +x_0=164041.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 20.5, maxLat: 21.3, minLon: -157.7, maxLon: -156.0 } },
      { zoneName: 'Zone 4', fipsCode: '5104', epsgMeters: 6453, proj4Meters: '+proj=tmerc +lat_0=19.5 +lon_0=-155.5 +k=0.999966667 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6454, proj4SurveyFeet: '+proj=tmerc +lat_0=19.5 +lon_0=-155.5 +k=0.999966667 +x_0=164041.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 18.9, maxLat: 20.3, minLon: -156.1, maxLon: -154.8 } },
      { zoneName: 'Zone 5', fipsCode: '5105', epsgMeters: 6455, proj4Meters: '+proj=tmerc +lat_0=19.1666666666667 +lon_0=-155.166666666667 +k=0.999966667 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6456, proj4SurveyFeet: '+proj=tmerc +lat_0=19.1666666666667 +lon_0=-155.166666666667 +k=0.999966667 +x_0=164041.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 18.9, maxLat: 20.3, minLon: -156.1, maxLon: -154.8 } }
    ]
  },
  {
    stateName: 'Idaho',
    stateCode: 'ID',
    zones: [
      { zoneName: 'East', fipsCode: '1101', epsgMeters: 6457, proj4Meters: '+proj=tmerc +lat_0=42 +lon_0=-112.166666666667 +k=0.999958333 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6458, proj4SurveyFeet: '+proj=tmerc +lat_0=42 +lon_0=-112.166666666667 +k=0.999958333 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 42.0, maxLat: 49.0, minLon: -113.0, maxLon: -111.0 } },
      { zoneName: 'Central', fipsCode: '1102', epsgMeters: 6459, proj4Meters: '+proj=tmerc +lat_0=42 +lon_0=-114 +k=0.999958333 +x_0=500000 +y_0=100000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6460, proj4SurveyFeet: '+proj=tmerc +lat_0=42 +lon_0=-114 +k=0.999958333 +x_0=1640416.66666667 +y_0=328083.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 42.0, maxLat: 49.0, minLon: -115.0, maxLon: -113.0 } },
      { zoneName: 'West', fipsCode: '1103', epsgMeters: 6461, proj4Meters: '+proj=tmerc +lat_0=42 +lon_0=-115.75 +k=0.999958333 +x_0=800000 +y_0=200000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6462, proj4SurveyFeet: '+proj=tmerc +lat_0=42 +lon_0=-115.75 +k=0.999958333 +x_0=2624666.66666667 +y_0=656166.666666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 42.0, maxLat: 49.0, minLon: -117.0, maxLon: -115.0 } }
    ]
  },
  {
    stateName: 'Illinois',
    stateCode: 'IL',
    zones: [
      { zoneName: 'East', fipsCode: '1201', epsgMeters: 6463, proj4Meters: '+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6464, proj4SurveyFeet: '+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=984250 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 36.9, maxLat: 42.5, minLon: -89.5, maxLon: -87.5 } },
      { zoneName: 'West', fipsCode: '1202', epsgMeters: 6465, proj4Meters: '+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941667 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6466, proj4SurveyFeet: '+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941667 +x_0=2296583.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 36.9, maxLat: 42.5, minLon: -91.5, maxLon: -88.9 } }
    ]
  },
  {
    stateName: 'Indiana',
    stateCode: 'IN',
    zones: [
      { zoneName: 'East', fipsCode: '1301', epsgMeters: 6467, proj4Meters: '+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6468, proj4SurveyFeet: '+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=328083.333333333 +y_0=820208.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 37.8, maxLat: 41.8, minLon: -86.5, maxLon: -84.8 } },
      { zoneName: 'West', fipsCode: '1302', epsgMeters: 6469, proj4Meters: '+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=500000 +y_0=250000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6470, proj4SurveyFeet: '+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=1640416.66666667 +y_0=820208.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 37.8, maxLat: 41.8, minLon: -88.1, maxLon: -86.2 } }
    ]
  },
  {
    stateName: 'Iowa',
    stateCode: 'IA',
    zones: [
      { zoneName: 'North', fipsCode: '1401', epsgMeters: 6471, proj4Meters: '+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.1666666666667 +lat_2=41.8333333333333 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6472, proj4SurveyFeet: '+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.1666666666667 +lat_2=41.8333333333333 +x_0=4921250 +y_0=3280833.33333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 41.6, maxLat: 43.5, minLon: -96.6, maxLon: -90.1 } },
      { zoneName: 'South', fipsCode: '1402', epsgMeters: 6473, proj4Meters: '+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6474, proj4SurveyFeet: '+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.3, maxLat: 42.0, minLon: -96.6, maxLon: -90.1 } }
    ]
  },
  {
    stateName: 'Kansas',
    stateCode: 'KS',
    zones: [
      { zoneName: 'North', fipsCode: '1501', epsgMeters: 6475, proj4Meters: '+proj=lcc +lat_0=38.3333333333333 +lon_0=-98.5 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6476, proj4SurveyFeet: '+proj=lcc +lat_0=38.3333333333333 +lon_0=-98.5 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=1312333.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.5, maxLat: 40.0, minLon: -102.1, maxLon: -94.6 } },
      { zoneName: 'South', fipsCode: '1502', epsgMeters: 6477, proj4Meters: '+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.45 +lat_2=37.25 +x_0=400000 +y_0=400000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6478, proj4SurveyFeet: '+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.45 +lat_2=37.25 +x_0=1312333.33333333 +y_0=1312333.33333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.0, maxLat: 38.7, minLon: -102.1, maxLon: -94.6 } }
    ]
  },
  {
    stateName: 'Kentucky',
    stateCode: 'KY',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '1600', epsgMeters: 6479, proj4Meters: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6480, proj4SurveyFeet: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 36.5, maxLat: 39.1, minLon: -89.6, maxLon: -81.9 } },
      { zoneName: 'North', fipsCode: '1601', epsgMeters: 6481, proj4Meters: '+proj=lcc +lat_0=37.5 +lon_0=-83.5 +lat_1=38.6333333333333 +lat_2=37.7666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6482, proj4SurveyFeet: '+proj=lcc +lat_0=37.5 +lon_0=-83.5 +lat_1=38.6333333333333 +lat_2=37.7666666666667 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.5, maxLat: 39.1, minLon: -86.0, maxLon: -82.0 } },
      { zoneName: 'South', fipsCode: '1602', epsgMeters: 6483, proj4Meters: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=500000 +y_0=500000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6484, proj4SurveyFeet: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=1640416.66666667 +y_0=1640416.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 36.5, maxLat: 38.2, minLon: -89.6, maxLon: -81.9 } }
    ]
  },
  {
    stateName: 'Louisiana',
    stateCode: 'LA',
    zones: [
      { zoneName: 'North', fipsCode: '1701', epsgMeters: 6485, proj4Meters: '+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6486, proj4SurveyFeet: '+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=3280833.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 31.0, maxLat: 33.0, minLon: -94.1, maxLon: -88.8 } },
      { zoneName: 'South', fipsCode: '1702', epsgMeters: 6487, proj4Meters: '+proj=lcc +lat_0=28.3333333333333 +lon_0=-91.3333333333333 +lat_1=29.8333333333333 +lat_2=29 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6488, proj4SurveyFeet: '+proj=lcc +lat_0=28.3333333333333 +lon_0=-91.3333333333333 +lat_1=29.8333333333333 +lat_2=29 +x_0=3280833.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 28.9, maxLat: 31.3, minLon: -94.1, maxLon: -88.8 } },
      { zoneName: 'Offshore', fipsCode: '1703', epsgMeters: 6489, proj4Meters: '+proj=lcc +lat_0=26 +lon_0=-91.5 +lat_1=27.8333333333333 +lat_2=26.3333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6490, proj4SurveyFeet: '+proj=lcc +lat_0=26 +lon_0=-91.5 +lat_1=27.8333333333333 +lat_2=26.3333333333333 +x_0=3280833.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 26.0, maxLat: 29.0, minLon: -94.1, maxLon: -88.0 } }
    ]
  },
  {
    stateName: 'Maryland',
    stateCode: 'MD',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '1900', epsgMeters: 6491, proj4Meters: '+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=39.45 +lat_2=38.3 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6492, proj4SurveyFeet: '+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=39.45 +lat_2=38.3 +x_0=1312333.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.9, maxLat: 39.8, minLon: -79.5, maxLon: -75.0 } }
    ]
  },
  {
    stateName: 'Massachusetts',
    stateCode: 'MA',
    zones: [
      { zoneName: 'Mainland', fipsCode: '2001', epsgMeters: 6493, proj4Meters: '+proj=lcc +lat_0=41 +lon_0=-71.5 +lat_1=42.6833333333333 +lat_2=41.7166666666667 +x_0=200000 +y_0=750000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6494, proj4SurveyFeet: '+proj=lcc +lat_0=41 +lon_0=-71.5 +lat_1=42.6833333333333 +lat_2=41.7166666666667 +x_0=656166.666666667 +y_0=2460625 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 41.4, maxLat: 42.9, minLon: -73.5, maxLon: -69.9 } },
      { zoneName: 'Island', fipsCode: '2002', epsgMeters: 6495, proj4Meters: '+proj=lcc +lat_0=41 +lon_0=-70.5 +lat_1=41.4833333333333 +lat_2=41.2833333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6496, proj4SurveyFeet: '+proj=lcc +lat_0=41 +lon_0=-70.5 +lat_1=41.4833333333333 +lat_2=41.2833333333333 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 41.1, maxLat: 41.5, minLon: -70.9, maxLon: -69.9 } }
    ]
  },
  {
    stateName: 'Michigan',
    stateCode: 'MI',
    zones: [
      { zoneName: 'North', fipsCode: '2111', epsgMeters: 6497, proj4Meters: '+proj=lcc +lat_0=44.55 +lon_0=-87 +lat_1=47.1166666666667 +lat_2=45.5833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6498, proj4SurveyFeet: '+proj=lcc +lat_0=44.55 +lon_0=-87 +lat_1=47.1166666666667 +lat_2=45.5833333333333 +x_0=26246666.6666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 45.3, maxLat: 48.2, minLon: -90.4, maxLon: -83.3 } },
      { zoneName: 'Central', fipsCode: '2112', epsgMeters: 6499, proj4Meters: '+proj=lcc +lat_0=43.0166666666667 +lon_0=-84.3333333333333 +lat_1=45.4666666666667 +lat_2=44.1 +x_0=6000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6500, proj4SurveyFeet: '+proj=lcc +lat_0=43.0166666666667 +lon_0=-84.3333333333333 +lat_1=45.4666666666667 +lat_2=44.1 +x_0=19685000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 43.8, maxLat: 45.7, minLon: -87.2, maxLon: -82.4 } },
      { zoneName: 'South', fipsCode: '2113', epsgMeters: 6501, proj4Meters: '+proj=lcc +lat_0=41.5 +lon_0=-84.3333333333333 +lat_1=43.4333333333333 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6502, proj4SurveyFeet: '+proj=lcc +lat_0=41.5 +lon_0=-84.3333333333333 +lat_1=43.4333333333333 +lat_2=42.1 +x_0=13123333.3333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 41.7, maxLat: 44.1, minLon: -86.8, maxLon: -82.1 } }
    ]
  },
  {
    stateName: 'Minnesota',
    stateCode: 'MN',
    zones: [
      { zoneName: 'North', fipsCode: '2201', epsgMeters: 6503, proj4Meters: '+proj=lcc +lat_0=46.5 +lon_0=-93.0833333333333 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6504, proj4SurveyFeet: '+proj=lcc +lat_0=46.5 +lon_0=-93.0833333333333 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=2624666.66666667 +y_0=328083.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 46.8, maxLat: 49.4, minLon: -97.2, maxLon: -89.5 } },
      { zoneName: 'Central', fipsCode: '2202', epsgMeters: 6505, proj4Meters: '+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.4166666666667 +lat_2=45.65 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6506, proj4SurveyFeet: '+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.4166666666667 +lat_2=45.65 +x_0=2624666.66666667 +y_0=328083.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 45.4, maxLat: 47.7, minLon: -97.2, maxLon: -91.9 } },
      { zoneName: 'South', fipsCode: '2203', epsgMeters: 6507, proj4Meters: '+proj=lcc +lat_0=43.3333333333333 +lon_0=-94 +lat_1=45.3333333333333 +lat_2=43.8 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6508, proj4SurveyFeet: '+proj=lcc +lat_0=43.3333333333333 +lon_0=-94 +lat_1=45.3333333333333 +lat_2=43.8 +x_0=2624666.66666667 +y_0=328083.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 43.5, maxLat: 45.6, minLon: -97.1, maxLon: -91.2 } }
    ]
  },
  {
    stateName: 'Mississippi',
    stateCode: 'MS',
    zones: [
      { zoneName: 'East', fipsCode: '2301', epsgMeters: 6509, proj4Meters: '+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6510, proj4SurveyFeet: '+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 30.1, maxLat: 35.0, minLon: -89.7, maxLon: -88.1 } },
      { zoneName: 'West', fipsCode: '2302', epsgMeters: 6511, proj4Meters: '+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.999958333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6512, proj4SurveyFeet: '+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.999958333 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 30.1, maxLat: 35.0, minLon: -91.7, maxLon: -89.4 } }
    ]
  },
  {
    stateName: 'Missouri',
    stateCode: 'MO',
    zones: [
      { zoneName: 'East', fipsCode: '2401', epsgMeters: 6513, proj4Meters: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6514, proj4SurveyFeet: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=820208.333333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 36.0, maxLat: 40.6, minLon: -91.6, maxLon: -89.1 } },
      { zoneName: 'Central', fipsCode: '2402', epsgMeters: 6515, proj4Meters: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6516, proj4SurveyFeet: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 36.0, maxLat: 40.6, minLon: -93.6, maxLon: -91.4 } },
      { zoneName: 'West', fipsCode: '2403', epsgMeters: 6517, proj4Meters: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-94.5 +k=0.999933333 +x_0=850000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6518, proj4SurveyFeet: '+proj=tmerc +lat_0=35.8333333333333 +lon_0=-94.5 +k=0.999933333 +x_0=2788708.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 36.0, maxLat: 40.6, minLon: -95.8, maxLon: -93.4 } }
    ]
  },
  {
    stateName: 'Montana',
    stateCode: 'MT',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '2500', epsgMeters: 6519, proj4Meters: '+proj=lcc +lat_0=44.25 +lon_0=-109.5 +lat_1=49 +lat_2=45 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6520, proj4SurveyFeet: '+proj=lcc +lat_0=44.25 +lon_0=-109.5 +lat_1=49 +lat_2=45 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 44.4, maxLat: 49.0, minLon: -116.1, maxLon: -104.0 } }
    ]
  },
  {
    stateName: 'Nebraska',
    stateCode: 'NE',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '2600', epsgMeters: 6521, proj4Meters: '+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6522, proj4SurveyFeet: '+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.0, maxLat: 43.0, minLon: -104.1, maxLon: -95.3 } }
    ]
  },
  {
    stateName: 'Nevada',
    stateCode: 'NV',
    zones: [
      { zoneName: 'East', fipsCode: '2701', epsgMeters: 6523, proj4Meters: '+proj=tmerc +lat_0=34.75 +lon_0=-115.666666666667 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6524, proj4SurveyFeet: '+proj=tmerc +lat_0=34.75 +lon_0=-115.666666666667 +k=0.9999 +x_0=656166.666666667 +y_0=26246666.6666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 35.0, maxLat: 42.0, minLon: -116.6, maxLon: -114.0 } },
      { zoneName: 'Central', fipsCode: '2702', epsgMeters: 6525, proj4Meters: '+proj=tmerc +lat_0=34.75 +lon_0=-117 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6526, proj4SurveyFeet: '+proj=tmerc +lat_0=34.75 +lon_0=-117 +k=0.9999 +x_0=1640416.66666667 +y_0=19685000 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 35.0, maxLat: 42.0, minLon: -117.9, maxLon: -115.4 } },
      { zoneName: 'West', fipsCode: '2703', epsgMeters: 6527, proj4Meters: '+proj=tmerc +lat_0=34.75 +lon_0=-118.666666666667 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6528, proj4SurveyFeet: '+proj=tmerc +lat_0=34.75 +lon_0=-118.666666666667 +k=0.9999 +x_0=2624666.66666667 +y_0=13123333.3333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 35.0, maxLat: 42.0, minLon: -120.0, maxLon: -117.3 } }
    ]
  },
  {
    stateName: 'New Jersey',
    stateCode: 'NJ',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '2900', epsgMeters: 6529, proj4Meters: '+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6530, proj4SurveyFeet: '+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=492125 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 38.9, maxLat: 41.4, minLon: -75.6, maxLon: -73.9 } }
    ]
  },
  {
    stateName: 'New Mexico',
    stateCode: 'NM',
    zones: [
      { zoneName: 'East', fipsCode: '3001', epsgMeters: 6531, proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6532, proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=492125 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 31.0, maxLat: 37.0, minLon: -105.4, maxLon: -103.0 } },
      { zoneName: 'Central', fipsCode: '3002', epsgMeters: 6533, proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.999909091 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6534, proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.999909091 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 31.0, maxLat: 37.0, minLon: -107.2, maxLon: -105.2 } },
      { zoneName: 'West', fipsCode: '3003', epsgMeters: 6535, proj4Meters: '+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999909091 +x_0=850000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6536, proj4SurveyFeet: '+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999909091 +x_0=2788708.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 31.0, maxLat: 37.0, minLon: -109.1, maxLon: -107.1 } }
    ]
  },
  {
    stateName: 'New York',
    stateCode: 'NY',
    zones: [
      { zoneName: 'East', fipsCode: '3101', epsgMeters: 6537, proj4Meters: '+proj=tmerc +lat_0=40 +lon_0=-74.3333333333333 +k=0.999966667 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6538, proj4SurveyFeet: '+proj=tmerc +lat_0=40 +lon_0=-74.3333333333333 +k=0.999966667 +x_0=492125 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 40.5, maxLat: 45.1, minLon: -75.4, maxLon: -73.2 } },
      { zoneName: 'Central', fipsCode: '3102', epsgMeters: 6539, proj4Meters: '+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.999966667 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6540, proj4SurveyFeet: '+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.999966667 +x_0=820208.333333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 40.5, maxLat: 45.1, minLon: -77.9, maxLon: -75.3 } },
      { zoneName: 'West', fipsCode: '3103', epsgMeters: 6541, proj4Meters: '+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.999966667 +x_0=350000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6542, proj4SurveyFeet: '+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.999966667 +x_0=1148291.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 40.5, maxLat: 45.1, minLon: -79.8, maxLon: -77.4 } },
      { zoneName: 'Long Island', fipsCode: '3104', epsgMeters: 6543, proj4Meters: '+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=41.0333333333333 +lat_2=40.6666666666667 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6544, proj4SurveyFeet: '+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=41.0333333333333 +lat_2=40.6666666666667 +x_0=984250 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.5, maxLat: 41.3, minLon: -74.3, maxLon: -71.8 } }
    ]
  },
  {
    stateName: 'North Carolina',
    stateCode: 'NC',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '3200', epsgMeters: 6545, proj4Meters: '+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6546, proj4SurveyFeet: '+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=2000000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 33.8, maxLat: 36.6, minLon: -84.3, maxLon: -75.4 } }
    ]
  },
  {
    stateName: 'North Dakota',
    stateCode: 'ND',
    zones: [
      { zoneName: 'North', fipsCode: '3301', epsgMeters: 6547, proj4Meters: '+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.2666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6548, proj4SurveyFeet: '+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.2666666666667 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 47.0, maxLat: 49.0, minLon: -104.1, maxLon: -96.5 } },
      { zoneName: 'South', fipsCode: '3302', epsgMeters: 6549, proj4Meters: '+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4333333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6550, proj4SurveyFeet: '+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4333333333333 +lat_2=46.1833333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 45.9, maxLat: 47.7, minLon: -104.1, maxLon: -96.5 } }
    ]
  },
  {
    stateName: 'Ohio',
    stateCode: 'OH',
    zones: [
      { zoneName: 'North', fipsCode: '3401', epsgMeters: 6551, proj4Meters: '+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6552, proj4SurveyFeet: '+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.2, maxLat: 42.3, minLon: -84.8, maxLon: -80.5 } },
      { zoneName: 'South', fipsCode: '3402', epsgMeters: 6553, proj4Meters: '+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=39.9666666666667 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6554, proj4SurveyFeet: '+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=39.9666666666667 +lat_2=38.7333333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.4, maxLat: 40.3, minLon: -84.8, maxLon: -80.5 } }
    ]
  },
  {
    stateName: 'Oklahoma',
    stateCode: 'OK',
    zones: [
      { zoneName: 'North', fipsCode: '3501', epsgMeters: 6555, proj4Meters: '+proj=lcc +lat_0=34.8333333333333 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6556, proj4SurveyFeet: '+proj=lcc +lat_0=34.8333333333333 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 35.3, maxLat: 37.0, minLon: -103.0, maxLon: -94.4 } },
      { zoneName: 'South', fipsCode: '3502', epsgMeters: 6557, proj4Meters: '+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2666666666667 +lat_2=33.9 +x_0=600000 +y_0=300000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6558, proj4SurveyFeet: '+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2666666666667 +lat_2=33.9 +x_0=1968500 +y_0=984250 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 33.6, maxLat: 35.5, minLon: -103.0, maxLon: -94.4 } }
    ]
  },
  {
    stateName: 'Oregon',
    stateCode: 'OR',
    zones: [
      { zoneName: 'North', fipsCode: '3601', epsgMeters: 6559, proj4Meters: '+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6560, proj4SurveyFeet: '+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=8202083.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 44.0, maxLat: 46.3, minLon: -124.6, maxLon: -116.4 } },
      { zoneName: 'South', fipsCode: '3602', epsgMeters: 6561, proj4Meters: '+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6562, proj4SurveyFeet: '+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=4921250 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 42.0, maxLat: 44.3, minLon: -124.6, maxLon: -116.4 } }
    ]
  },
  {
    stateName: 'Pennsylvania',
    stateCode: 'PA',
    zones: [
      { zoneName: 'North', fipsCode: '3701', epsgMeters: 6563, proj4Meters: '+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6564, proj4SurveyFeet: '+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.6, maxLat: 42.0, minLon: -80.6, maxLon: -74.7 } },
      { zoneName: 'South', fipsCode: '3702', epsgMeters: 6565, proj4Meters: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6566, proj4SurveyFeet: '+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 39.7, maxLat: 41.2, minLon: -80.6, maxLon: -74.7 } }
    ]
  },
  {
    stateName: 'Rhode Island',
    stateCode: 'RI',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '3800', epsgMeters: 6567, proj4Meters: '+proj=tmerc +lat_0=41.0833333333333 +lon_0=-71.5 +k=0.99999375 +x_0=100000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6568, proj4SurveyFeet: '+proj=tmerc +lat_0=41.0833333333333 +lon_0=-71.5 +k=0.99999375 +x_0=328083.333333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 41.1, maxLat: 42.1, minLon: -71.9, maxLon: -71.1 } }
    ]
  },
  {
    stateName: 'South Carolina',
    stateCode: 'SC',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '3900', epsgMeters: 6569, proj4Meters: '+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6570, proj4SurveyFeet: '+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=2000000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 32.0, maxLat: 35.2, minLon: -83.4, maxLon: -78.5 } }
    ]
  },
  {
    stateName: 'South Dakota',
    stateCode: 'SD',
    zones: [
      { zoneName: 'North', fipsCode: '4001', epsgMeters: 6571, proj4Meters: '+proj=lcc +lat_0=43.8333333333333 +lon_0=-100.25 +lat_1=45.7 +lat_2=44.2333333333333 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6572, proj4SurveyFeet: '+proj=lcc +lat_0=43.8333333333333 +lon_0=-100.25 +lat_1=45.7 +lat_2=44.2333333333333 +x_0=2296583.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 44.0, maxLat: 45.9, minLon: -104.1, maxLon: -96.4 } },
      { zoneName: 'South', fipsCode: '4002', epsgMeters: 6573, proj4Meters: '+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=700000 +y_0=300000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6574, proj4SurveyFeet: '+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=2296583.33333333 +y_0=984250 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 42.4, maxLat: 44.7, minLon: -104.1, maxLon: -96.4 } }
    ]
  },
  {
    stateName: 'Tennessee',
    stateCode: 'TN',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '4100', epsgMeters: 6575, proj4Meters: '+proj=lcc +lat_0=34.3333333333333 +lon_0=-86 +lat_1=36.4166666666667 +lat_2=35.25 +x_0=600000 +y_0=100000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6576, proj4SurveyFeet: '+proj=lcc +lat_0=34.3333333333333 +lon_0=-86 +lat_1=36.4166666666667 +lat_2=35.25 +x_0=1968500 +y_0=328083.333333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 34.9, maxLat: 36.7, minLon: -90.3, maxLon: -81.6 } }
    ]
  },
  {
    stateName: 'Texas',
    stateCode: 'TX',
    zones: [
      { zoneName: 'North', fipsCode: '4201', epsgMeters: 6577, proj4Meters: '+proj=lcc +lat_0=31.6666666666667 +lon_0=-101.5 +lat_1=33.3 +lat_2=32.0333333333333 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6578, proj4SurveyFeet: '+proj=lcc +lat_0=31.6666666666667 +lon_0=-101.5 +lat_1=33.3 +lat_2=32.0333333333333 +x_0=3280833.33333333 +y_0=3280833.33333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 31.8, maxLat: 33.5, minLon: -103.1, maxLon: -100.0 } },
      { zoneName: 'North Central', fipsCode: '4202', epsgMeters: 6579, proj4Meters: '+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6580, proj4SurveyFeet: '+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9 +lat_2=32.1333333333333 +x_0=1968500 +y_0=6561666.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 31.9, maxLat: 34.3, minLon: -100.3, maxLon: -94.0 } },
      { zoneName: 'Central', fipsCode: '4203', epsgMeters: 6581, proj4Meters: '+proj=lcc +lat_0=29.5833333333333 +lon_0=-99 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=300000 +y_0=3000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6582, proj4SurveyFeet: '+proj=lcc +lat_0=29.5833333333333 +lon_0=-99 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=984250 +y_0=9842500 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 29.8, maxLat: 32.2, minLon: -106.6, maxLon: -97.0 } },
      { zoneName: 'South Central', fipsCode: '4204', epsgMeters: 6583, proj4Meters: '+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=29.5833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6584, proj4SurveyFeet: '+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=29.5833333333333 +lat_2=28.3833333333333 +x_0=1968500 +y_0=13123333.3333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 28.1, maxLat: 29.9, minLon: -100.6, maxLon: -96.4 } },
      { zoneName: 'South', fipsCode: '4205', epsgMeters: 6585, proj4Meters: '+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.2833333333333 +x_0=300000 +y_0=5000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6586, proj4SurveyFeet: '+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.2833333333333 +x_0=984250 +y_0=16404166.6666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 25.8, maxLat: 28.1, minLon: -100.4, maxLon: -97.1 } }
    ]
  },
  {
    stateName: 'Utah',
    stateCode: 'UT',
    zones: [
      { zoneName: 'North', fipsCode: '4301', epsgMeters: 6587, proj4Meters: '+proj=lcc +lat_0=40.5 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.8166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6588, proj4SurveyFeet: '+proj=lcc +lat_0=40.5 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.8166666666667 +x_0=1640416.66666667 +y_0=3280833.33333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 40.6, maxLat: 42.0, minLon: -114.1, maxLon: -109.0 } },
      { zoneName: 'Central', fipsCode: '4302', epsgMeters: 6589, proj4Meters: '+proj=lcc +lat_0=38.8333333333333 +lon_0=-111.5 +lat_1=40.4333333333333 +lat_2=39.0333333333333 +x_0=500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6590, proj4SurveyFeet: '+proj=lcc +lat_0=38.8333333333333 +lon_0=-111.5 +lat_1=40.4333333333333 +lat_2=39.0333333333333 +x_0=1640416.66666667 +y_0=6561666.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.8, maxLat: 40.7, minLon: -114.1, maxLon: -109.0 } },
      { zoneName: 'South', fipsCode: '4303', epsgMeters: 6591, proj4Meters: '+proj=lcc +lat_0=37.1666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6592, proj4SurveyFeet: '+proj=lcc +lat_0=37.1666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=1640416.66666667 +y_0=9842500 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.0, maxLat: 38.6, minLon: -114.1, maxLon: -109.0 } }
    ]
  },
  {
    stateName: 'Vermont',
    stateCode: 'VT',
    zones: [
      { zoneName: 'Single Zone', fipsCode: '4400', epsgMeters: 6593, proj4Meters: '+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6594, proj4SurveyFeet: '+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 42.7, maxLat: 45.1, minLon: -73.4, maxLon: -71.5 } }
    ]
  },
  {
    stateName: 'Virginia',
    stateCode: 'VA',
    zones: [
      { zoneName: 'North', fipsCode: '4501', epsgMeters: 6595, proj4Meters: '+proj=lcc +lat_0=37.5 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6596, proj4SurveyFeet: '+proj=lcc +lat_0=37.5 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=11482916.6666667 +y_0=6561666.66666667 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.8, maxLat: 39.7, minLon: -83.7, maxLon: -75.2 } },
      { zoneName: 'South', fipsCode: '4502', epsgMeters: 6597, proj4Meters: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6598, proj4SurveyFeet: '+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=11482916.6666667 +y_0=3280833.33333333 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 36.5, maxLat: 38.2, minLon: -83.7, maxLon: -75.2 } }
    ]
  },
  {
    stateName: 'Washington',
    stateCode: 'WA',
    zones: [
      { zoneName: 'North', fipsCode: '4601', epsgMeters: 6599, proj4Meters: '+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6600, proj4SurveyFeet: '+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 47.2, maxLat: 49.0, minLon: -124.8, maxLon: -117.0 } },
      { zoneName: 'South', fipsCode: '4602', epsgMeters: 6601, proj4Meters: '+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6602, proj4SurveyFeet: '+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3 +lat_2=45.8333333333333 +x_0=1640416.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 45.5, maxLat: 47.6, minLon: -124.8, maxLon: -117.0 } }
    ]
  },
  {
    stateName: 'West Virginia',
    stateCode: 'WV',
    zones: [
      { zoneName: 'North', fipsCode: '4701', epsgMeters: 6603, proj4Meters: '+proj=lcc +lat_0=38.3333333333333 +lon_0=-81 +lat_1=40.2166666666667 +lat_2=38.7833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6604, proj4SurveyFeet: '+proj=lcc +lat_0=38.3333333333333 +lon_0=-81 +lat_1=40.2166666666667 +lat_2=38.7833333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 38.5, maxLat: 40.6, minLon: -82.7, maxLon: -79.0 } },
      { zoneName: 'South', fipsCode: '4702', epsgMeters: 6605, proj4Meters: '+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.6166666666667 +lat_2=37.3166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6606, proj4SurveyFeet: '+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.6166666666667 +lat_2=37.3166666666667 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 37.1, maxLat: 38.9, minLon: -82.7, maxLon: -79.0 } }
    ]
  },
  {
    stateName: 'Wisconsin',
    stateCode: 'WI',
    zones: [
      { zoneName: 'North', fipsCode: '4801', epsgMeters: 6607, proj4Meters: '+proj=lcc +lat_0=44 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6608, proj4SurveyFeet: '+proj=lcc +lat_0=44 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 44.0, maxLat: 47.1, minLon: -92.9, maxLon: -86.2 } },
      { zoneName: 'Central', fipsCode: '4802', epsgMeters: 6609, proj4Meters: '+proj=lcc +lat_0=43.5833333333333 +lon_0=-90 +lat_1=45 +lat_2=44.0666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6610, proj4SurveyFeet: '+proj=lcc +lat_0=43.5833333333333 +lon_0=-90 +lat_1=45 +lat_2=44.0666666666667 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 43.8, maxLat: 45.2, minLon: -92.9, maxLon: -86.9 } },
      { zoneName: 'South', fipsCode: '4803', epsgMeters: 6611, proj4Meters: '+proj=lcc +lat_0=42.3333333333333 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6612, proj4SurveyFeet: '+proj=lcc +lat_0=42.3333333333333 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'LCC', bounds: { minLat: 42.5, maxLat: 44.3, minLon: -91.5, maxLon: -87.8 } }
    ]
  },
  {
    stateName: 'Wyoming',
    stateCode: 'WY',
    zones: [
      { zoneName: 'East', fipsCode: '4901', epsgMeters: 6613, proj4Meters: '+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6614, proj4SurveyFeet: '+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=656166.666666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 41.0, maxLat: 45.0, minLon: -106.0, maxLon: -104.0 } },
      { zoneName: 'East Central', fipsCode: '4902', epsgMeters: 6615, proj4Meters: '+proj=tmerc +lat_0=40.5 +lon_0=-107 +k=0.9999375 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6616, proj4SurveyFeet: '+proj=tmerc +lat_0=40.5 +lon_0=-107 +k=0.9999375 +x_0=1312333.33333333 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 41.0, maxLat: 45.0, minLon: -107.9, maxLon: -105.7 } },
      { zoneName: 'West Central', fipsCode: '4903', epsgMeters: 6617, proj4Meters: '+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6618, proj4SurveyFeet: '+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=1968500 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 41.0, maxLat: 45.0, minLon: -109.8, maxLon: -107.6 } },
      { zoneName: 'West', fipsCode: '4904', epsgMeters: 6619, proj4Meters: '+proj=tmerc +lat_0=40.5 +lon_0=-110.583333333333 +k=0.9999375 +x_0=800000 +y_0=0 +ellps=GRS80 +units=m +no_defs', epsgSurveyFeet: 6620, proj4SurveyFeet: '+proj=tmerc +lat_0=40.5 +lon_0=-110.583333333333 +k=0.9999375 +x_0=2624666.66666667 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs', projType: 'TM', bounds: { minLat: 41.0, maxLat: 45.0, minLon: -111.1, maxLon: -109.5 } }
    ]
  }
];

/** * HELPER: Find a zone by its EPSG code 
*/
export const findZoneByEPSG = (code: number): SPCS2011Zone | undefined => {
  for (const state of spcs2011Data) {
      const found = state.zones.find(z => z.epsgMeters === code || z.epsgSurveyFeet === code);
      if (found) return found;
  }
  return undefined;
};
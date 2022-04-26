import weaviate from "../index";

describe("the graphql journey", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("creates a schema class", () => {
    // this is just test setup, not part of what we want to test here
    return setup(client);
  });

  test("graphql get method with minimal fields", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toEqual(3);
      });
  });

  test("graphql get method with optional fields", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .withNearText({ concepts: ["news"], certainty: 0.1 })
      .withWhere({
        operator: "GreaterThanEqual",
        path: ["wordCount"],
        valueInt: 50,
      })
      .withLimit(7)
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBeLessThan(3);
        expect(result.data.Get.Article[0]["title"].length).toBeGreaterThan(0);
        expect(result.data.Get.Article[0]["url"].length).toBeGreaterThan(0);
        expect(result.data.Get.Article[0]["wordCount"]).toBeGreaterThanOrEqual(
          50
        );
      });
  });

  test("graphql get with group", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .withGroup({ type: "merge", force: 1.0 })
      .withLimit(7)
      .do()
      .then(function (result) {
        // merging with a force of 1 means we merge everyting into a single
        // element
        expect(result.data.Get.Article.length).toBe(1);
      });
  });

  test("graphql get with nearVector", () => {
    var searchVec = [-0.15047126, 0.061322376, -0.17812507, 0.12811552, 0.36847013, -0.50840724, -0.10406531, 0.11413283, 0.2997712, 0.7039331, 0.22155242, 0.1413957, 0.025396502, 0.14802167, 0.26640236, 0.15965445, -0.45570126, -0.5215438, 0.14628491, 0.10946681, 0.0040095793, 0.017442623, -0.1988451, -0.05362646, 0.104278944, -0.2506941, 0.2667653, 0.36438593, -0.44370207, 0.07204353, 0.077371456, 0.14557181, 0.6026817, 0.45073593, 0.09438019, 0.03936342, -0.20441438, 0.12333719, -0.20247602, 0.5078446, -0.06079732, -0.02166342, 0.02165861, -0.11712191, 0.0493167, -0.012123002, 0.26458082, -0.10784768, -0.26852348, 0.049759883, -0.39999008, -0.08977922, 0.003169497, -0.36184034, -0.069065355, 0.18940343, 0.5684866, -0.24626277, -0.2326087, 0.090373255, 0.33161184, -1.0541122, -0.039116446, -0.17496277, -0.16834813, -0.0765323, -0.16189013, -0.062876746, -0.19826415, 0.07437007, -0.018362755, 0.23634757, -0.19062655, -0.26524994, 0.33691254, -0.1926698, 0.018848037, 0.1735524, 0.34301907, -0.014238952, -0.07596742, -0.61302894, -0.044652265, 0.1545376, 0.67256856, 0.08630557, 0.50236076, 0.23438522, 0.27686095, 0.13633616, -0.27525797, 0.04282576, 0.18319897, -0.008353968, -0.27330264, 0.12624736, -0.17051372, -0.35854533, -0.008455927, 0.154786, -0.20306401, -0.09021733, 0.80594194, 0.036562894, -0.48894945, -0.27981675, -0.5001396, -0.3581464, -0.057082724, -0.0051904973, -0.3209166, 0.057098284, 0.111587055, -0.09097725, -0.213181, -0.5038173, -0.024070809, -0.05350453, 0.13345918, -0.42136985, 0.24050911, -0.2556207, 0.03156968, 0.4381214, 0.053237516, -0.20783865, 1.885739, 0.28429136, -0.12231187, -0.30934808, 0.032250155, -0.32959512, 0.08670603, -0.60112613, -0.43010503, 0.70870006, 0.3548015, -0.010406012, 0.036294986, 0.0030629474, -0.017579105, 0.28948352, -0.48063236, -0.39739868, 0.17860937, 0.5099417, -0.24304488, -0.12671146, -0.018249692, -0.32057074, -0.08146134, 0.3572229, -0.47601065, 0.35100546, -0.19663939, 0.34194613, -0.04653828, 0.47278664, -0.8723091, -0.19756387, -0.5890681, 0.16688067, -0.23709822, -0.26478595, -0.18792373, 0.2204168, 0.030987943, 0.15885714, -0.38817936, -0.4194334, -0.3287098, 0.15394142, -0.09496768, 0.6561987, -0.39340565, -0.5479265, -0.22363484, -0.1193662, 0.2014849, 0.31138006, -0.45485613, -0.9879565, 0.3708223, 0.17318928, 0.21229307, 0.042776756, -0.077399045, 0.42621315, -0.09917796, 0.34220153, 0.06380378, 0.14129028, -0.14563583, -0.07081333, 0.026335392, 0.10566285, -0.28074324, -0.059861198, -0.24855351, 0.13623764, -0.8228192, -0.15095113, 0.16250934, 0.031107651, -0.1504525, 0.20840737, 0.12919411, -0.0926323, 0.30937102, 0.16636328, -0.36754072, 0.035581365, -0.2799259, 0.1446048, -0.11680267, 0.13226685, 0.175023, -0.18840964, 0.27609056, -0.09350581, 0.08284562, 0.45897093, 0.13188471, -0.07115303, 0.18009436, 0.16689545, -0.6991295, 0.26496106, -0.29619592, -0.19242188, -0.6362671, -0.16330126, 0.2474778, 0.37738156, -0.12921557, -0.07843309, 0.28509396, 0.5658691, 0.16096894, 0.095068075, 0.02419672, -0.30691084, 0.21180221, 0.21670066, 0.0027263877, 0.30853105, -0.16187873, 0.20786561, 0.22136153, -0.008828387, -0.011165021, 0.60076475, 0.0089871045, 0.6179727, -0.38049766, -0.08179336, -0.15306218, -0.13186441, -0.5360041, -0.06123339, -0.06399122, 0.21292226, -0.18383273, -0.21540102, 0.28566808, -0.29953584, -0.36946672, 0.03341637, -0.08435299, -0.5381947, -0.28651953, 0.08704594, -0.25493965, 0.0019178925, -0.7242109, 0.3578676, -0.55617595, -0.01930952, 0.32922924, 0.14903364, 0.21613406, -0.11927183, 0.15165499, -0.10101261, 0.2499076, -0.18526322, -0.057230365, 0.10008554, 0.16178907, 0.39356324, -0.03106238, 0.09375929, 0.17185533, 0.10400415, -0.36850816, 0.18424486, -0.081376314, 0.23645392, 0.05198973, 0.09471436];

    return client.graphql
      .get()
      .withClassName("Article")
      .withNearVector({ vector: searchVec, certainty: 0.7 })
      .withFields("_additional { id }")
      .do()
      .then((res) => {
        expect(res.data.Get.Article.length).toBe(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql get with nearObject", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee", certainty: 0.7 })
      .withFields("_additional { id }")
      .do()
      .then((res) => {
        expect(res.data.Get.Article.length).toBe(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql get with nearText", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withNearText({ concepts: ["Article"], certainty: 0.7 })
      .withFields("_additional { id }")
      .do()
      .then((res) => {
        expect(res.data.Get.Article.length).toBe(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql get expected failure - multiple nearMedia filters", () => {
    return expect(() => {
      client.graphql
        .get()
        .withClassName("Article")
        .withNearText({ concepts: ["iphone"] })
        .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee", certainty: 0.65 })
        .do()
    })
      .toThrow("cannot use multiple near<Media> filters in a single query")
  });

  test("graphql aggregate method with minimal fields", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method optional fields", () => {
    // Note this test is ignoring `.withGroupBy()` due to
    // https://github.com/semi-technologies/weaviate/issues/1238

    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withWhere({
        path: ["title"],
        valueString: "apple",
        operator: "Equal",
      })
      .withLimit(10)
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with nearVector", () => {
    var searchVec = [-0.15047126, 0.061322376, -0.17812507, 0.12811552, 0.36847013, -0.50840724, -0.10406531, 0.11413283, 0.2997712, 0.7039331, 0.22155242, 0.1413957, 0.025396502, 0.14802167, 0.26640236, 0.15965445, -0.45570126, -0.5215438, 0.14628491, 0.10946681, 0.0040095793, 0.017442623, -0.1988451, -0.05362646, 0.104278944, -0.2506941, 0.2667653, 0.36438593, -0.44370207, 0.07204353, 0.077371456, 0.14557181, 0.6026817, 0.45073593, 0.09438019, 0.03936342, -0.20441438, 0.12333719, -0.20247602, 0.5078446, -0.06079732, -0.02166342, 0.02165861, -0.11712191, 0.0493167, -0.012123002, 0.26458082, -0.10784768, -0.26852348, 0.049759883, -0.39999008, -0.08977922, 0.003169497, -0.36184034, -0.069065355, 0.18940343, 0.5684866, -0.24626277, -0.2326087, 0.090373255, 0.33161184, -1.0541122, -0.039116446, -0.17496277, -0.16834813, -0.0765323, -0.16189013, -0.062876746, -0.19826415, 0.07437007, -0.018362755, 0.23634757, -0.19062655, -0.26524994, 0.33691254, -0.1926698, 0.018848037, 0.1735524, 0.34301907, -0.014238952, -0.07596742, -0.61302894, -0.044652265, 0.1545376, 0.67256856, 0.08630557, 0.50236076, 0.23438522, 0.27686095, 0.13633616, -0.27525797, 0.04282576, 0.18319897, -0.008353968, -0.27330264, 0.12624736, -0.17051372, -0.35854533, -0.008455927, 0.154786, -0.20306401, -0.09021733, 0.80594194, 0.036562894, -0.48894945, -0.27981675, -0.5001396, -0.3581464, -0.057082724, -0.0051904973, -0.3209166, 0.057098284, 0.111587055, -0.09097725, -0.213181, -0.5038173, -0.024070809, -0.05350453, 0.13345918, -0.42136985, 0.24050911, -0.2556207, 0.03156968, 0.4381214, 0.053237516, -0.20783865, 1.885739, 0.28429136, -0.12231187, -0.30934808, 0.032250155, -0.32959512, 0.08670603, -0.60112613, -0.43010503, 0.70870006, 0.3548015, -0.010406012, 0.036294986, 0.0030629474, -0.017579105, 0.28948352, -0.48063236, -0.39739868, 0.17860937, 0.5099417, -0.24304488, -0.12671146, -0.018249692, -0.32057074, -0.08146134, 0.3572229, -0.47601065, 0.35100546, -0.19663939, 0.34194613, -0.04653828, 0.47278664, -0.8723091, -0.19756387, -0.5890681, 0.16688067, -0.23709822, -0.26478595, -0.18792373, 0.2204168, 0.030987943, 0.15885714, -0.38817936, -0.4194334, -0.3287098, 0.15394142, -0.09496768, 0.6561987, -0.39340565, -0.5479265, -0.22363484, -0.1193662, 0.2014849, 0.31138006, -0.45485613, -0.9879565, 0.3708223, 0.17318928, 0.21229307, 0.042776756, -0.077399045, 0.42621315, -0.09917796, 0.34220153, 0.06380378, 0.14129028, -0.14563583, -0.07081333, 0.026335392, 0.10566285, -0.28074324, -0.059861198, -0.24855351, 0.13623764, -0.8228192, -0.15095113, 0.16250934, 0.031107651, -0.1504525, 0.20840737, 0.12919411, -0.0926323, 0.30937102, 0.16636328, -0.36754072, 0.035581365, -0.2799259, 0.1446048, -0.11680267, 0.13226685, 0.175023, -0.18840964, 0.27609056, -0.09350581, 0.08284562, 0.45897093, 0.13188471, -0.07115303, 0.18009436, 0.16689545, -0.6991295, 0.26496106, -0.29619592, -0.19242188, -0.6362671, -0.16330126, 0.2474778, 0.37738156, -0.12921557, -0.07843309, 0.28509396, 0.5658691, 0.16096894, 0.095068075, 0.02419672, -0.30691084, 0.21180221, 0.21670066, 0.0027263877, 0.30853105, -0.16187873, 0.20786561, 0.22136153, -0.008828387, -0.011165021, 0.60076475, 0.0089871045, 0.6179727, -0.38049766, -0.08179336, -0.15306218, -0.13186441, -0.5360041, -0.06123339, -0.06399122, 0.21292226, -0.18383273, -0.21540102, 0.28566808, -0.29953584, -0.36946672, 0.03341637, -0.08435299, -0.5381947, -0.28651953, 0.08704594, -0.25493965, 0.0019178925, -0.7242109, 0.3578676, -0.55617595, -0.01930952, 0.32922924, 0.14903364, 0.21613406, -0.11927183, 0.15165499, -0.10101261, 0.2499076, -0.18526322, -0.057230365, 0.10008554, 0.16178907, 0.39356324, -0.03106238, 0.09375929, 0.17185533, 0.10400415, -0.36850816, 0.18424486, -0.081376314, 0.23645392, 0.05198973, 0.09471436];

    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearVector({ vector: searchVec, certainty: 0.7 })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with nearObject", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee", certainty: 0.7 })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with nearText", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearText({ concepts: ["Article"], certainty: 0.7 })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method expected failure - multiple nearMedia filters", () => {
    return expect(() => {
      client.graphql
        .aggregate()
        .withClassName("Article")
        .withNearText({ concepts: ["iphone"] })
        .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee", certainty: 0.65 })
        .do()
    })
      .toThrow("cannot use multiple near<Media> filters in a single query")
  });

  test("graphql aggregate method with where and nearVector", () => {
    var searchVec = [-0.15047126, 0.061322376, -0.17812507, 0.12811552, 0.36847013, -0.50840724, -0.10406531, 0.11413283, 0.2997712, 0.7039331, 0.22155242, 0.1413957, 0.025396502, 0.14802167, 0.26640236, 0.15965445, -0.45570126, -0.5215438, 0.14628491, 0.10946681, 0.0040095793, 0.017442623, -0.1988451, -0.05362646, 0.104278944, -0.2506941, 0.2667653, 0.36438593, -0.44370207, 0.07204353, 0.077371456, 0.14557181, 0.6026817, 0.45073593, 0.09438019, 0.03936342, -0.20441438, 0.12333719, -0.20247602, 0.5078446, -0.06079732, -0.02166342, 0.02165861, -0.11712191, 0.0493167, -0.012123002, 0.26458082, -0.10784768, -0.26852348, 0.049759883, -0.39999008, -0.08977922, 0.003169497, -0.36184034, -0.069065355, 0.18940343, 0.5684866, -0.24626277, -0.2326087, 0.090373255, 0.33161184, -1.0541122, -0.039116446, -0.17496277, -0.16834813, -0.0765323, -0.16189013, -0.062876746, -0.19826415, 0.07437007, -0.018362755, 0.23634757, -0.19062655, -0.26524994, 0.33691254, -0.1926698, 0.018848037, 0.1735524, 0.34301907, -0.014238952, -0.07596742, -0.61302894, -0.044652265, 0.1545376, 0.67256856, 0.08630557, 0.50236076, 0.23438522, 0.27686095, 0.13633616, -0.27525797, 0.04282576, 0.18319897, -0.008353968, -0.27330264, 0.12624736, -0.17051372, -0.35854533, -0.008455927, 0.154786, -0.20306401, -0.09021733, 0.80594194, 0.036562894, -0.48894945, -0.27981675, -0.5001396, -0.3581464, -0.057082724, -0.0051904973, -0.3209166, 0.057098284, 0.111587055, -0.09097725, -0.213181, -0.5038173, -0.024070809, -0.05350453, 0.13345918, -0.42136985, 0.24050911, -0.2556207, 0.03156968, 0.4381214, 0.053237516, -0.20783865, 1.885739, 0.28429136, -0.12231187, -0.30934808, 0.032250155, -0.32959512, 0.08670603, -0.60112613, -0.43010503, 0.70870006, 0.3548015, -0.010406012, 0.036294986, 0.0030629474, -0.017579105, 0.28948352, -0.48063236, -0.39739868, 0.17860937, 0.5099417, -0.24304488, -0.12671146, -0.018249692, -0.32057074, -0.08146134, 0.3572229, -0.47601065, 0.35100546, -0.19663939, 0.34194613, -0.04653828, 0.47278664, -0.8723091, -0.19756387, -0.5890681, 0.16688067, -0.23709822, -0.26478595, -0.18792373, 0.2204168, 0.030987943, 0.15885714, -0.38817936, -0.4194334, -0.3287098, 0.15394142, -0.09496768, 0.6561987, -0.39340565, -0.5479265, -0.22363484, -0.1193662, 0.2014849, 0.31138006, -0.45485613, -0.9879565, 0.3708223, 0.17318928, 0.21229307, 0.042776756, -0.077399045, 0.42621315, -0.09917796, 0.34220153, 0.06380378, 0.14129028, -0.14563583, -0.07081333, 0.026335392, 0.10566285, -0.28074324, -0.059861198, -0.24855351, 0.13623764, -0.8228192, -0.15095113, 0.16250934, 0.031107651, -0.1504525, 0.20840737, 0.12919411, -0.0926323, 0.30937102, 0.16636328, -0.36754072, 0.035581365, -0.2799259, 0.1446048, -0.11680267, 0.13226685, 0.175023, -0.18840964, 0.27609056, -0.09350581, 0.08284562, 0.45897093, 0.13188471, -0.07115303, 0.18009436, 0.16689545, -0.6991295, 0.26496106, -0.29619592, -0.19242188, -0.6362671, -0.16330126, 0.2474778, 0.37738156, -0.12921557, -0.07843309, 0.28509396, 0.5658691, 0.16096894, 0.095068075, 0.02419672, -0.30691084, 0.21180221, 0.21670066, 0.0027263877, 0.30853105, -0.16187873, 0.20786561, 0.22136153, -0.008828387, -0.011165021, 0.60076475, 0.0089871045, 0.6179727, -0.38049766, -0.08179336, -0.15306218, -0.13186441, -0.5360041, -0.06123339, -0.06399122, 0.21292226, -0.18383273, -0.21540102, 0.28566808, -0.29953584, -0.36946672, 0.03341637, -0.08435299, -0.5381947, -0.28651953, 0.08704594, -0.25493965, 0.0019178925, -0.7242109, 0.3578676, -0.55617595, -0.01930952, 0.32922924, 0.14903364, 0.21613406, -0.11927183, 0.15165499, -0.10101261, 0.2499076, -0.18526322, -0.057230365, 0.10008554, 0.16178907, 0.39356324, -0.03106238, 0.09375929, 0.17185533, 0.10400415, -0.36850816, 0.18424486, -0.081376314, 0.23645392, 0.05198973, 0.09471436];

    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearVector({ vector: searchVec, certainty: 0.7 })
      .withWhere({
        operator: "Equal",
        path: ["_id"],
        valueString: "abefd256-8574-442b-9293-9205193737ee",
      })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with where and nearObject", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee", certainty: 0.7 })
      .withWhere({
        operator: "Equal",
        path: ["_id"],
        valueString: "abefd256-8574-442b-9293-9205193737ee",
      })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with where and nearText", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearText({ concepts: ["Article"], certainty: 0.7 })
      .withWhere({
        operator: "Equal",
        path: ["_id"],
        valueString: "abefd256-8574-442b-9293-9205193737ee",
      })
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method with objectLimit", () => {
    var objectLimit = 1

    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withNearText({ concepts: ["Article"], certainty: 0.7 })
      .withObjectLimit(objectLimit)
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(objectLimit);
      })
      .catch((e) => fail("it should not have error'd" + e)); 
  });

  test("graphql aggregate method with bad objectLimit input", () => {
    var objectLimit = -1.1

    return expect(() => {
      client.graphql
        .aggregate()
        .withClassName("Article")
        .withNearText({ concepts: ["Article"], certainty: 0.7 })
        .withObjectLimit(objectLimit)
        .withFields("meta { count }")
        .do()
    })
      .toThrow("objectLimit must be a non-negative integer");
  });

  test("graphql explore with minimal fields", () => {
    return client.graphql
      .explore()
      .withNearText({ concepts: ["iphone"] })
      .withFields("beacon certainty className")
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toBeGreaterThan(0);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql explore with optional fields", () => {
    return client.graphql
      .explore()
      .withNearText({ concepts: ["iphone"] })
      .withFields("beacon certainty className")
      .withLimit(1)
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql explore with nearObject field", () => {
    return client.graphql
      .explore()
      .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee" })
      .withFields("beacon certainty className")
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toBeGreaterThan(0);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql get method with sort filter: wordCount asc", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("wordCount")
      .withSort({
        path: ["wordCount"]
      })
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBe(3);
        expect(result.data.Get.Article[0]["wordCount"]).toEqual(40);
        expect(result.data.Get.Article[1]["wordCount"]).toEqual(60);
        expect(result.data.Get.Article[2]["wordCount"]).toEqual(600);
      });
  });

  test("graphql get method with [sort] filter: wordCount asc", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("wordCount")
      .withSort([{ path: ["wordCount"], order: "asc" }])
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBe(3);
        expect(result.data.Get.Article[0]["wordCount"]).toEqual(40);
        expect(result.data.Get.Article[1]["wordCount"]).toEqual(60);
        expect(result.data.Get.Article[2]["wordCount"]).toEqual(600);
      });
  });

  test("graphql get method with sort filter: title desc", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title")
      .withSort({ path: ["title"], order: "desc" })
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBe(3);
        expect(result.data.Get.Article[0]["title"]).toEqual("Article about Apple");
        expect(result.data.Get.Article[1]["title"]).toEqual("Article 2");
        expect(result.data.Get.Article[2]["title"]).toEqual("Article 1");
      });
  });

  test("graphql get method with [sort] filter: title desc", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title")
      .withSort([{ path: ["title"], order: "desc" }])
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBe(3);
        expect(result.data.Get.Article[0]["title"]).toEqual("Article about Apple");
        expect(result.data.Get.Article[1]["title"]).toEqual("Article 2");
        expect(result.data.Get.Article[2]["title"]).toEqual("Article 1");
      });
  });

  test("graphql get method with [sort] filters", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title")
      .withSort([
        { path: ["wordCount"], order: "asc" },
        { path: ["title"], order: "desc" },
      ])
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBe(3);
        expect(result.data.Get.Article[0]["title"]).toEqual("Article 2");
        expect(result.data.Get.Article[1]["title"]).toEqual("Article 1");
        expect(result.data.Get.Article[2]["title"]).toEqual("Article about Apple");
      });
  });

  test("graphql get method with creationTimeUnix filter", async () => {
    var expected = await client.graphql
      .get()
      .withClassName("Article")
      .withFields("_additional { creationTimeUnix }")
      .do()
      .then(res => {
        expect(res.data.Get.Article.length).toBeGreaterThan(0)
        return res
      });
    
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("_additional { id creationTimeUnix }")
      .withWhere({
        path: ["_creationTimeUnix"], 
        operator: "Equal", 
        valueString: expected.data.Get.Article[0]._additional.creationTimeUnix
      })
      .do()
      .then(res => {
        expect(res.data.Get.Article.length).toBeGreaterThan(0)
        expect(res.data.Get.Article[0]._additional.creationTimeUnix)
          .toEqual(expected.data.Get.Article[0]._additional.creationTimeUnix)
      });
  });

  test("graphql get method with lastUpdateTimeUnix filter", async () => {
    var expected = await client.graphql
      .get()
      .withClassName("Article")
      .withFields("_additional { lastUpdateTimeUnix }")
      .do()
      .then(res => {
        expect(res.data.Get.Article.length).toBeGreaterThan(0)
        return res
      });
    
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("_additional { id lastUpdateTimeUnix }")
      .withWhere({
        path: ["_lastUpdateTimeUnix"], 
        operator: "Equal", 
        valueString: expected.data.Get.Article[0]._additional.lastUpdateTimeUnix
      })
      .do()
      .then(res => {
        expect(res.data.Get.Article.length).toBeGreaterThan(0)
        expect(res.data.Get.Article[0]._additional.lastUpdateTimeUnix)
          .toEqual(expected.data.Get.Article[0]._additional.lastUpdateTimeUnix)
      });
  });

  it("tears down and cleans up", () => {
    return Promise.all([
      client.schema.classDeleter().withClassName("Article").do(),
    ]);
  });
});

const setup = async (client) => {
  const thing = {
    class: "Article",
    invertedIndexConfig: {indexTimestamps: true},
    properties: [
      {
        name: "title",
        dataType: ["text"],
      },
      {
        name: "url",
        dataType: ["string"],
      },
      {
        name: "wordCount",
        dataType: ["int"],
      },
    ],
  };

  await Promise.all([client.schema.classCreator().withClass(thing).do()]);

  const toImport = [
    {
      id: "abefd256-8574-442b-9293-9205193737ee",
      class: "Article",
      properties: {
        wordCount: 60,
        url: "http://articles.local/my-article-1",
        title: "Article 1",
      },
    },
    {
      class: "Article",
      properties: {
        wordCount: 40,
        url: "http://articles.local/my-article-2",
        title: "Article 2",
      },
    },
    {
      class: "Article",
      properties: {
        wordCount: 600,
        url: "http://articles.local/my-article-3",
        title: "Article about Apple",
      },
    },
  ];

  let batch = client.batch.objectsBatcher();

  toImport.forEach((elem) => {
    batch = batch.withObject(elem);
  });

  await batch.do();
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

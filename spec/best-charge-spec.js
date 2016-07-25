describe('Take out food', function () {

  xit('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  xit('should generate best charge when best is 满30减6元', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  xit('should generate best charge when no promotion can be used', function () {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});

describe('formatSelectedItemss', function () {
  it('should format Items with id and count', function () {
    let tags = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let expected = [{id: 'ITEM0001', count: 1}, {id: 'ITEM0013', count: 2}, {id: 'ITEM0022', count: 1}];
    let formatedTags = formatSelectedItems(tags);

    expect(formatedTags).toEqual(expected);
  })
});

describe('getMenuItems', function () {
  it('should return menuItems', function () {
    let test = [{id: 'ITEM0001', count: 1}, {id: 'ITEM0013', count: 2}, {id: 'ITEM0022', count: 1}];
    let allItems = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00}, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00
    }, {id: 'ITEM0022', name: '凉皮', price: 8.00}, {
      id: 'ITEM0030',
      name: '冰锋',
      price: 2.00
    }];
    let expected = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      count: 1
    }, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      count: 2
    }, {
      id: 'ITEM0022',
      name: '凉皮',
      price: 8.00,
      count: 1
    }];
    let result = getMenuItems(test, allItems);
    expect(result).toEqual(expected);
  });
});

describe('getPromotedItems', function () {
  it('should return promotedItems with type', function () {
    let menuItems = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00}, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00
    }, {id: 'ITEM0022', name: '凉皮', price: 8.00}];
    let allPromotionItems = [{
      type: '满30减6元'
    }, {
      type: '指定菜品半价',
      items: ['ITEM0001', 'ITEM0022']
    }]

    let expected = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00, type: '指定菜品半价'}, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      type: '满30减6元'
    }, {id: 'ITEM0022', name: '凉皮', price: 8.00, type: '指定菜品半价'}];
    let result = getPromotedItems(menuItems, allPromotionItems);

    expect(result).toEqual(expected);
  });

});

describe('getSubTotal', function () {
  it('should return items with subTotal', function () {
    let test = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00, type: '指定菜品半价', count: 1}];
    let expeced = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00, type: '指定菜品半价', count: 1, subTotal: 18.00}];
    let result = getSubTotal(test);
    expect(result).toEqual(expeced);
  })
})

describe('getSubSaveMoney', function () {
  it('should return items with subTotal', function () {
    let test = [{id: 'ITEM0001', name: '黄焖鸡', price: 18.00, type: '指定菜品半价', count: 1, subTotal: 18.00}];
    let expected = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      type: '指定菜品半价',
      count: 1,
      subTotal: 18.00,
      subSaveMoney: 9.00
    }];
    let result = getSubSaveMoney(test);
    expect(result).toEqual(expected);
  })
})

describe('getTotalAndSaveMoney', function () {
  it('should return Object with total and saveMoney', function () {
    let test = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      type: '指定菜品半价',
      count: 1,
      subTotal: 18.00,
      subSaveMoney: 9.00
    }];
    let result = getTotalAndSaveMoney(test);
    let expected = {total: 18.00, saveMoney: 9.00};
    expect(result).toEqual(expected);
  });
});

describe('choosePromotionType', function () {
  it('should return promotedChoice with protomtedType of 指定菜品半价', function () {
    let test = {total: 18, saveMoney: 9};
    let expected = {total: 18, saveMoney: 9, promotedType: '指定菜品半价'};
    let result = choosePromotionType(test);
    expect(result).toEqual(expected);
  });
  it('should return promotedChoice with promotedType of 指定菜品半价', function () {
    let test = {total: 31, saveMoney: 9};
    let expected = {total: 22, saveMoney: 9, promotedType: '指定菜品半价'};
    let result = choosePromotionType(test);
    expect(result).toEqual(expected);
  });
  it('should return promotedChoice with promotedType of 满30减6元', function () {
    let test = {total: 31, saveMoney: 5};
    let expected = {total: 25, saveMoney: 6, promotedType: '满30减6元'};
    let result = choosePromotionType(test);
    expect(result).toEqual(expected);
  });
})


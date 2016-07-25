function bestCharge(selectedItems) {

  let allItems = loadAllItems();
  let allPromotedItems = loadPromotions();
  let formatedTags = formatSelectedItems(selectedItems);
  let menuItems = getMenuItems(formatedTags, allItems);
  let beforePromotedMenuItems = getSubTotal(menuItems);
  let promotedMenuItems = getPromotedMenuItems(beforePromotedMenuItems, allPromotedItems);
  let detailedPromotedMenuItems = getSubSaveMoney(promotedMenuItems);
  let totalAndSaveMoney = getTotalAndSaveMoney(detailedPromotedMenuItems);
  let promotedChoice = choosePromotion(totalAndSaveMoney);
  let receipt = print(detailedPromotedMenuItems, promotedChoice);

  return receipt;
}

function formatSelectedItems(selectedItems) {
  return selectedItems.map(function (selectedItem) {
    let temp = selectedItem.split('x');
    return {id: temp[0].trim(), count: Number(temp[1])};
  });
}

function getMenuItems(formatedItems, allItems) {
  let menuItems = [];
  formatedItems.reduce(function (cur, newValue) {
    let exist = cur.find(function (item) {
      return item.id === newValue.id;
    });

    if (exist) {
      menuItems.push(Object.assign({}, exist, {count: newValue.count}));
    }
    return cur;
  }, allItems);
  return menuItems;
}

function getPromotedItems(menuItems, allPromotedItems) {
  let promotedMenuItems = [];
  for (let i = 0; i < menuItems.length; i++) {
    promotedMenuItems.push(Object.assign({}, menuItems[i], {type: allPromotedItems[0].type}));
    for (let j = 1; j < allPromotedItems.length; j++) {
      for (let k = 0; k < allPromotedItems[j].items.length; k++) {
        if (menuItems[i].id === allPromotedItems[j].items[k]) {
          promotedMenuItems[i].type = allPromotedItems[j].type;
          break;
        }
      }
    }
  }
  return promotedMenuItems;
}

function getSubTotal(promotedMenuItems) {
  let beforePromotedItems = [];
  for (let i = 0; i < promotedMenuItems.length; i++) {
    beforePromotedItems.push(Object.assign({}, promotedMenuItems[i], {subTotal: promotedMenuItems[i].price * promotedMenuItems[i].count}));
  }
  return beforePromotedItems;
}

function getSubSaveMoney(beforePromotedItems) {
  let detailedMenuItems = [];
  for (let i = 0; i < beforePromotedItems.length; i++) {
    if (beforePromotedItems[i].type === '指定菜品半价') {
      detailedMenuItems.push(Object.assign({}, beforePromotedItems[i], {subSaveMoney: beforePromotedItems[i].subTotal / 2}));
    }
    else {
      detailedMenuItems.push(Object.assign({}, beforePromotedItems[i], {subSaveMoney: 0}));
    }
  }
  return detailedMenuItems;
}

function getTotalAndSaveMoney(detailedMenuItems) {
  let total = 0, saveMoney = 0;

  for (let i = 0; i < detailedMenuItems.length; i++) {
    total += detailedMenuItems[i].subTotal;
    saveMoney += detailedMenuItems[i].subSaveMoney;
  }

  return Object.assign({}, {total: total, saveMoney: saveMoney});
}

function choosePromotionType(totalAndSaveMoney) {
  if (totalAndSaveMoney.total > 30) {
    if (totalAndSaveMoney.saveMoney > 6) {
      return Object.assign({}, {
        total: totalAndSaveMoney.total - totalAndSaveMoney.saveMoney,
        saveMoney: totalAndSaveMoney.saveMoney
      }, {promotedType: '指定菜品半价'});
    }
    else {
      return Object.assign({}, {total: totalAndSaveMoney.total - 6, saveMoney: 6}, {promotedType: '满30减6元'});
    }
  }
  else if (totalAndSaveMoney.saveMoney != 0) {
    return Object.assign({}, totalAndSaveMoney, {promotedType: '指定菜品半价'});
  }

}

function print(detailedMenuItems, promotedChoice) {
  let receiptString = '============= 订餐明细 =============';
  let string='(';
  for (let i = 0; i < detailedMenuItems.length; i++) {
    receiptString = receiptString + '\n' + detailedMenuItems[i].name + 'x' + detailedMenuItems[i].count + '=' + promotedChoice.total + '元';
  }

  if(promotedChoice.promotedType==='指定菜品半价')
  {
    for(let i=0;i<detailedMenuItems.length;i++)
    {
      string+=detailedMenuItems[i].name+',';
    }
    string=string.slice(0,string.length-1)+')';

    receiptString += '\n' + '-----------------------------------' + '\n' + '使用优惠:'+'\n'+string+'，省'+promotedChoice.saveMoney+'元'+'\n'+'\n';
  }

}

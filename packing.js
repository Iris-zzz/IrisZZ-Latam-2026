// Pages Functions：packing 的多端同步接口，带合并迁移逻辑，支持批量勾选(ids)
// 读取时把 DEFAULT 里新增/修改的条目合并进已存数据，保留已勾选的 done 状态；DEFAULT 里已删除的旧条目会被淘汰。

const DEFAULT_LIST = [{"id": "p1", "group": "背包与收纳", "text": "40L 背包 ×2(Osprey/Fairview,你们已经买了)", "done": true}, {"id": "p2", "group": "背包与收纳", "text": "Sea to Summit Ultra-Sil 22L 轻量副包(徒步/雨林日游用)", "done": true}, {"id": "p3", "group": "背包与收纳", "text": "防盗腰包", "done": true}, {"id": "p4", "group": "背包与收纳", "text": "行李锁 ×2", "done": true}, {"id": "p5", "group": "背包与收纳", "text": "晾衣绳", "done": true}, {"id": "p6", "group": "背包与收纳", "text": "压缩收纳袋(40L 装40天衣物,压缩袋能省不少空间)", "done": false}, {"id": "p7", "group": "分层衣物系统", "text": "速干短袖 ×3(墨西哥城/瓦哈卡/BA/伊瓜苏日常用)", "done": false}, {"id": "p8", "group": "分层衣物系统", "text": "速干长袖 ×2", "done": false}, {"id": "p9", "group": "分层衣物系统", "text": "美利奴羊毛打底 ×1-2(库斯科、巴塔哥尼亚保暖内层,连穿几天不容易有味)", "done": false}, {"id": "p10", "group": "分层衣物系统", "text": "抓绒/羊毛中层 ×1", "done": false}, {"id": "p11", "group": "分层衣物系统", "text": "轻薄羽绒或棉服 ×1(巴塔哥尼亚清晨傍晚、埃尔卡拉法特保暖)", "done": false}, {"id": "p12", "group": "分层衣物系统", "text": "防风防水冲锋衣 ×1(百内三塔峰、菲茨罗伊徒步全天风雨无遮挡,这件不能省)", "done": false}, {"id": "p13", "group": "分层衣物系统", "text": "徒步长裤(速干/可拆卸)×1-2", "done": false}, {"id": "p14", "group": "分层衣物系统", "text": "牛仔裤或日常长裤 ×1", "done": false}, {"id": "p15", "group": "分层衣物系统", "text": "短裤 ×2(墨西哥/BA炎热天气)", "done": false}, {"id": "p16", "group": "分层衣物系统", "text": "保暖抓绒裤/秋裤 ×1(巴塔哥尼亚清晨低温)", "done": false}, {"id": "p17", "group": "分层衣物系统", "text": "泳衣", "done": false}, {"id": "p18", "group": "分层衣物系统", "text": "内裤 ×7", "done": false}, {"id": "p19", "group": "分层衣物系统", "text": "运动内衣 ×2(Iris)", "done": false}, {"id": "p_socks2", "group": "分层衣物系统", "text": "日常袜子 ×6、徒步袜 ×1、高压袜 ×1", "done": false}, {"id": "p21", "group": "鞋类", "text": "徒步鞋(防水,建议出发前先磨合几次,三塔峰/菲茨罗伊是10小时级别的大重装日)", "done": false}, {"id": "p22", "group": "鞋类", "text": "轻便城市鞋或凉鞋(墨西哥/BA炎热街区)", "done": false}, {"id": "p23", "group": "鞋类", "text": "人字拖(住宿、雨林船上、洗澡用)", "done": false}, {"id": "p24", "group": "配件", "text": "遮阳帽(高海拔+雨林紫外线都很强)", "done": false}, {"id": "p25", "group": "配件", "text": "冷帽(巴塔哥尼亚)", "done": false}, {"id": "p26", "group": "配件", "text": "墨镜", "done": false}, {"id": "p_buff2", "group": "配件", "text": "BUFF 围脖/头巾(已买)", "done": true}, {"id": "p28", "group": "配件", "text": "薄手套(巴塔哥尼亚清晨徒步)", "done": false}, {"id": "p29", "group": "证件与财务", "text": "护照(检查有效期,至少覆盖回程后6个月)", "done": false}, {"id": "p30", "group": "证件与财务", "text": "US EVUS 更新(Iris,记得打印)", "done": false}, {"id": "p31", "group": "证件与财务", "text": "驾照国际翻译件(埃尔卡拉法特如果租车自驾用)", "done": false}, {"id": "p32", "group": "证件与财务", "text": "小饼照片打印备用", "done": false}, {"id": "p33", "group": "证件与财务", "text": "防盗手机挂绳 ×2", "done": false}, {"id": "p34", "group": "证件与财务", "text": "Wise / Amex 卡", "done": true}, {"id": "p_cash3", "group": "证件与财务", "text": "当地货币现金:墨西哥比索 / 秘鲁索尔 / 智利比索 / 阿根廷比索(到当地取现或换汇)", "done": false}, {"id": "p36", "group": "电子设备", "text": "南美/澳洲转换插头", "done": true}, {"id": "p37", "group": "电子设备", "text": "充电宝", "done": false}, {"id": "p38", "group": "电子设备", "text": "头灯(雨林夜游、徒步天不亮出发用)", "done": true}, {"id": "p39", "group": "电子设备", "text": "相机 + 备用电池 ×2 + SD卡 ×2", "done": false}, {"id": "p40", "group": "电子设备", "text": "Kindle", "done": false}, {"id": "p41", "group": "电子设备", "text": "耳机", "done": false}, {"id": "p_esim2", "group": "电子设备", "text": "电话卡 / eSIM(已买;Iris 的澳洲手机套餐已续)", "done": true}, {"id": "p43", "group": "洗漱与健康", "text": "高反药(库斯科、马丘比丘、惠曼塔湖用)", "done": true}, {"id": "p44", "group": "洗漱与健康", "text": "肠胃炎药", "done": true}, {"id": "p45", "group": "洗漱与健康", "text": "Hydralyte 电解质冲剂", "done": true}, {"id": "p46", "group": "洗漱与健康", "text": "防晒霜(高海拔+雨林紫外线强)", "done": false}, {"id": "p47", "group": "洗漱与健康", "text": "唇膏、滴眼液", "done": false}, {"id": "p_repel2", "group": "洗漱与健康", "text": "防蚊液(已买)", "done": true}, {"id": "p49", "group": "洗漱与健康", "text": "指甲刀", "done": false}, {"id": "p50", "group": "洗漱与健康", "text": "常备感冒药", "done": false}, {"id": "p51", "group": "旅行舒适装备", "text": "Sea to Summit 丝绸内胆睡袋(双人款,已买)", "done": true}, {"id": "p52", "group": "旅行舒适装备", "text": "Sea to Summit 充气旅行枕(已买)", "done": true}, {"id": "p53", "group": "旅行舒适装备", "text": "眼罩耳塞(已买)", "done": true}, {"id": "p54", "group": "旅行舒适装备", "text": "Sea to Summit 速干浴巾(已买)", "done": true}, {"id": "p55", "group": "旅行舒适装备", "text": "望远镜(观鸟/冰川用,已买)", "done": true}, {"id": "p101", "group": "电子设备", "text": "排插", "done": false}, {"id": "p102", "group": "洗漱与健康", "text": "水壶 ×2", "done": false}, {"id": "p103", "group": "洗漱与健康", "text": "洗漱用品、搓澡巾", "done": false}, {"id": "p104", "group": "证件与财务", "text": "疫苗小黄本(国际预防接种证书,已注射,出发要携带)", "done": false}, {"id": "p_usd", "group": "证件与财务", "text": "美元:已换好(含现金和 Wise 里的部分)", "done": true}];

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init && init.headers) }
  });
}

function mergeWithDefault(stored, defaults) {
  const storedMap = new Map(stored.map(x => [x.id, x]));
  return defaults.map(d => {
    const s = storedMap.get(d.id);
    return s ? { ...d, done: !!s.done } : { ...d };
  });
}

async function readList(env) {
  if (!env.TRIP_KV) return DEFAULT_LIST;
  const stored = await env.TRIP_KV.get('packing', 'json');
  const merged = stored ? mergeWithDefault(stored, DEFAULT_LIST) : DEFAULT_LIST;
  await env.TRIP_KV.put('packing', JSON.stringify(merged));
  return merged;
}

export async function onRequestGet(context) {
  return json(await readList(context.env));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, { status: 400 }); }
  // 兼容单个 id，也支持一次勾选多个 ids
  const ids = Array.isArray(body && body.ids) ? body.ids : (body && typeof body.id === 'string' ? [body.id] : null);
  if (!ids || !ids.length) return json({ error: 'missing id' }, { status: 400 });
  const idSet = new Set(ids.filter(x => typeof x === 'string'));
  const list = await readList(env);
  const next = list.map(t => (idSet.has(t.id) ? { ...t, done: !!body.done } : t));
  if (env.TRIP_KV) await env.TRIP_KV.put('packing', JSON.stringify(next));
  return json(next);
}

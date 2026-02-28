module.exports=[16085,a=>{"use strict";var b=a.i(37936),c=a.i(48734);async function d(a,b=20){return(0,c.query)(`SELECT donor_name, amount, message, is_anonymous, created_at
         FROM donations
         WHERE campaign_id = ? AND status = 'verified'
         ORDER BY created_at DESC
         LIMIT ?`,[a,b])}async function e(a){return await (0,c.execute)("UPDATE news SET view_count = view_count + 1 WHERE slug = ?",[a]),(0,c.queryFirst)(`SELECT n.*, cat.name as category_name, u.name as author_name
         FROM news n
         LEFT JOIN categories cat ON n.category_id = cat.id
         LEFT JOIN users u ON n.author_id = u.id
         WHERE n.slug = ?`,[a])}async function f(a,b,d=3){return(0,c.query)(`SELECT n.*, cat.name as category_name
         FROM news n
         LEFT JOIN categories cat ON n.category_id = cat.id
         WHERE n.status = 'published' AND n.id != ? AND n.category_id = ?
         ORDER BY n.published_at DESC LIMIT ?`,[a,b,d])}async function g(a){let b=(0,c.generateId)();return await (0,c.execute)("INSERT INTO contacts (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)",[b,a.name,a.email,a.phone||"",a.subject,a.message]),{id:b}}(0,a.i(13095).ensureServerEntryExports)([d,e,f,g]),(0,b.registerServerReference)(d,"60e31ddcb0447823b306bdb0e306027d7f8bda93a5",null),(0,b.registerServerReference)(e,"40a419a27ed8bce24fd0f6230cee833da17b97119b",null),(0,b.registerServerReference)(f,"7075ad8dc5ccfce89285818e099c8f6e9f27ca0d5c",null),(0,b.registerServerReference)(g,"407707b46bd1556ebd576f300bb0453c3f620b2f80",null),a.s(["getCampaignDonors",()=>d,"getNewsBySlug",()=>e,"getRelatedNews",()=>f,"submitContactForm",()=>g])},73153,a=>{"use strict";var b=a.i(39624),c=a.i(25737),d=a.i(16085);a.s([],27856),a.i(27856),a.s(["00cf2a8738ddd41ad6903161d87efa51e887637153",()=>c.getTheme,"40745ded225c07a0af4ec4245c71c88dec53a174cf",()=>c.setTheme,"40a419a27ed8bce24fd0f6230cee833da17b97119b",()=>d.getNewsBySlug,"40ccd30b3cc6655717bc8b6776451d6ff35c8e08bd",()=>b.default,"7075ad8dc5ccfce89285818e099c8f6e9f27ca0d5c",()=>d.getRelatedNews],73153)}];

//# sourceMappingURL=_9247955b._.js.map
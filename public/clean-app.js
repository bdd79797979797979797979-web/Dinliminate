
(function(){
'use strict';
var VERSION='clean-6-p635-audit', API='/api/restaurant-search';
var PHOTO={
spaghetti:'https://images.pexels.com/photos/6287520/pexels-photo-6287520.jpeg?auto=compress&cs=tinysrgb&w=1400',
chickenRice:'https://images.pexels.com/photos/5192403/pexels-photo-5192403.jpeg?auto=compress&cs=tinysrgb&w=1400',
tacos:'https://images.pexels.com/photos/15434316/pexels-photo-15434316.jpeg?auto=compress&cs=tinysrgb&w=1400',
stirFry:'https://images.pexels.com/photos/13065209/pexels-photo-13065209.jpeg?auto=compress&cs=tinysrgb&w=1400',
pizza:'https://images.pexels.com/photos/5903276/pexels-photo-5903276.jpeg?auto=compress&cs=tinysrgb&w=1400',
burger:'https://images.pexels.com/photos/12034622/pexels-photo-12034622.jpeg?auto=compress&cs=tinysrgb&w=1400',
eggs:'https://images.pexels.com/photos/5852231/pexels-photo-5852231.jpeg?auto=compress&cs=tinysrgb&w=1400',
soupSandwich:'https://images.pexels.com/photos/15305397/pexels-photo-15305397.jpeg?auto=compress&cs=tinysrgb&w=1400',
pasta:'https://images.pexels.com/photos/13294544/pexels-photo-13294544.jpeg?auto=compress&cs=tinysrgb&w=1400',
salad:'https://images.pexels.com/photos/11906476/pexels-photo-11906476.jpeg?auto=compress&cs=tinysrgb&w=1400',
mac:'https://images.pexels.com/photos/25449940/pexels-photo-25449940.jpeg?auto=compress&cs=tinysrgb&w=1400',
friedRice:'https://images.pexels.com/photos/32845321/pexels-photo-32845321.jpeg?auto=compress&cs=tinysrgb&w=1400',
grilledCheese:'https://images.pexels.com/photos/33706245/pexels-photo-33706245.jpeg?auto=compress&cs=tinysrgb&w=1400',
burrito:'https://images.pexels.com/photos/10696501/pexels-photo-10696501.jpeg?auto=compress&cs=tinysrgb&w=1400',
vegetable:'https://images.pexels.com/photos/33962492/pexels-photo-33962492.jpeg?auto=compress&cs=tinysrgb&w=1400',
meatloaf:'https://images.pexels.com/photos/2397401/pexels-photo-2397401.jpeg?auto=compress&cs=tinysrgb&w=1400',
stroganoff:'https://images.pexels.com/photos/1998918/pexels-photo-1998918.jpeg?auto=compress&cs=tinysrgb&w=1400',
salmon:'https://images.pexels.com/photos/31235406/pexels-photo-31235406.jpeg?auto=compress&cs=tinysrgb&w=1400',
lasagna:'https://images.pexels.com/photos/29174061/pexels-photo-29174061.jpeg?auto=compress&cs=tinysrgb&w=1400',
chickenParm:'https://images.pexels.com/photos/36863871/pexels-photo-36863871.jpeg?auto=compress&cs=tinysrgb&w=1400',
goulash:'https://hips.hearstapps.com/hmg-prod/images/american-chop-suey-american-goulash-with-elbow-royalty-free-image-1654804622.jpg?resize=1200:*',
southernVegPlate:'https://static.spotapps.co/spots/c2/7e1c43d84d40ceb08957852a6b91e1/full',
southernVegBeef:'https://calliesbiscuits.com/cdn/shop/articles/Blog_Resized21_1024x1024.jpg?v=1635184734',
chickenTenders:'https://slicelife.imgix.net/706/photos/original/Michaelangelos_ChickenTendersWFF.jpg?auto=compress&auto=format',
sloppy:'https://cdn.shopify.com/s/files/1/0984/6720/files/DSC_0239_32f6f925-62ba-481d-ab20-8b7903ba0659.jpg?v=1592862244',
cabbage:'https://savouryflavor.com/assets/images/1764611130433-fm0ektkv.webp',
steak:'https://resizer.otstatic.com/v3/photos/43647085-2',
potatoSoup:'https://www.cooksoups.com/assets/images/potato-bacon-soup.jpg',
beefStew:'https://images.pexels.com/photos/10692537/pexels-photo-10692537.jpeg?auto=compress&cs=tinysrgb&w=1400',
chickenNoodle:'https://images.pexels.com/photos/34326231/pexels-photo-34326231.jpeg?auto=compress&cs=tinysrgb&w=1400',
wings:'https://images.pexels.com/photos/8862753/pexels-photo-8862753.jpeg?auto=compress&cs=tinysrgb&w=1400',
baconEggs:'https://commons.wikimedia.org/wiki/Special:FilePath/Eggs%20and%20bacon.jpg?width=1400',
gyro:'https://images.pexels.com/photos/6941006/pexels-photo-6941006.jpeg?auto=compress&cs=tinysrgb&w=1400',
cereal:'https://commons.wikimedia.org/wiki/Special:FilePath/Cheerios.png?width=1400',
frozen:'https://www.goodnes.com/sites/g/files/jgfbjl321/files/styles/gdn_hero_pdp_product_image/public/gdn_product/field_product_images/stouffers-v978fpjmtmeos1u73ry3.jpg.webp?itok=-H2wBe3a',
fishSticks:'https://images.pexels.com/photos/5639413/pexels-photo-5639413.jpeg?auto=compress&cs=tinysrgb&w=1400',
philly:'https://images.pexels.com/photos/37324434/pexels-photo-37324434.jpeg?auto=compress&cs=tinysrgb&w=1400',
buttermilk:'https://images.pexels.com/photos/8489749/pexels-photo-8489749.jpeg?auto=compress&dpr=1&h=750&w=1260',
pbj:'https://commons.wikimedia.org/wiki/Special:FilePath/Peanut_butter_and_jelly_sandwich.jpg?width=1400',
ham:'https://images.pexels.com/photos/37228374/pexels-photo-37228374.jpeg?auto=compress&cs=tinysrgb&w=1400',
parfait:'https://images.pexels.com/photos/20691481/pexels-photo-20691481.jpeg?auto=compress&cs=tinysrgb&w=1400',
restaurant:'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1400',
smoothie:'https://images.pexels.com/photos/13116680/pexels-photo-13116680.jpeg?auto=compress&cs=tinysrgb&w=1400'
};
var foods=[
['Spaghetti',['pasta','italian','quick'],'spaghetti'],['Grilled Chicken + Rice',['chicken','healthy','rice'],'chickenRice'],['Tacos',['mexican','quick'],'tacos'],['Stir Fry',['asian','chicken','quick','rice','vegetable'],'stirFry'],['Homemade Pizza',['pizza','italian','quick'],'pizza'],['Burgers',['burger','quick'],'burger'],['Eggs & Toast',['breakfast','quick'],'eggs'],['Soup & Sandwich',['soup','sandwich','quick','comfort'],'soupSandwich'],['Pasta Alfredo',['pasta','italian','comfort'],'pasta'],['Salad Bowl',['healthy','vegetable','quick'],'salad'],['Mac & Cheese',['comfort','pasta','quick'],'mac'],['Fried Rice',['asian','quick','rice'],'friedRice'],['Grilled Cheese',['sandwich','quick','comfort'],'grilledCheese'],['Burrito Bowl',['mexican','beans','rice'],'burrito'],['Southern Vegetable Plate',['southern','country','vegetable','corn','beans','quick'],'southernVegPlate'],['Meatloaf & Mashed Potatoes',['comfort','beef','potato'],'meatloaf'],['Beef Stroganoff',['beef','comfort','pasta'],'stroganoff'],['Grilled Salmon',['seafood','healthy'],'salmon'],['Lasagna',['pasta','italian','comfort'],'lasagna'],['Chicken Parmesan',['chicken','italian','comfort'],'chickenParm'],['Goulash',['beef','pasta','tomato','comfort'],'goulash'],['Southern Vegetable Beef',['southern','beef','vegetable','tomato','corn','beans','soup'],'southernVegBeef'],['Chicken Tenders & Fries',['chicken','fries','quick','comfort'],'chickenTenders'],['Sloppy Joes & Fries',['beef','fries','quick','comfort'],'sloppy'],['Cabbage & Sausage',['southern','country','vegetable','quick'],'cabbage'],['Steak & Potato',['beef','steak','potato','comfort'],'steak'],['Chicken & Dumplings',['chicken','country','comfort','soup'],'chickenNoodle'],['Potato Soup',['soup','potato','comfort','quick'],'potatoSoup'],['Beef Stew',['beef','soup','comfort'],'beefStew'],['Chicken Noodle Soup',['chicken','soup','comfort','quick'],'chickenNoodle'],['Chicken Wings',['chicken','wings','quick','comfort'],'wings'],['Bacon & Eggs',['breakfast','quick','bacon'],'baconEggs'],['Gyro',['mediterranean','sandwich','quick'],'gyro'],['Bowl of Cereal',['breakfast','quick'],'cereal'],['Frozen Dinner',['quick','comfort'],'frozen'],['Fish Sticks',['seafood','fried','quick'],'fishSticks'],['Philly Cheesesteak',['beef','sandwich','comfort'],'philly'],['Buttermilk & Cornbread',['southern','country','quick','breakfast'],'buttermilk'],['Peanut Butter & Jelly Sandwich + Chips',['sandwich','quick'],'pbj'],['Ham Sandwich + Chips',['sandwich','quick'],'ham'],['Parfait',['breakfast','sweet','quick'],'parfait'],['Smoothie',['breakfast','drink','healthy','quick'],'smoothie']
].map(function(x,i){return{id:'food-'+(i+1),name:x[0],tags:x[1],photo:PHOTO[x[2]]||PHOTO.burger,type:'food'}});


// Phase 2 recovery: curated meals that existed in the fuller pre-clean catalog.
// Kept as data only; legacy UI/controller code is intentionally not restored.
var FOOD_RECIPES={"spaghetti":"Cook spaghetti until tender. Brown ground beef with onion and garlic, add tomato sauce, simmer 10–15 minutes, then toss with pasta and Parmesan.","grilled chicken + rice":"Season chicken and grill or pan-sear until cooked through. Serve over hot rice with vegetables or a simple side salad.","tacos":"Brown seasoned ground beef or chicken. Warm tortillas and fill with meat, lettuce, tomato, cheese and salsa.","stir fry":"Cook sliced chicken or beef in a hot skillet. Add vegetables, garlic and ginger; toss with soy-based sauce and serve over rice.","homemade pizza":"Top prepared pizza dough with sauce, mozzarella and favorite toppings. Bake in a very hot oven until the crust is browned and cheese is bubbling.","burgers":"Season ground beef, form patties and cook to your preferred doneness. Toast buns and add lettuce, tomato, pickles, cheese and sauce.","eggs & toast":"Fry or scramble two eggs. Toast bread and serve with butter, salt and pepper.","soup & sandwich":"Heat your favorite soup. Build a hot sandwich with bread, cheese or meat and vegetables; toast until crisp.","pasta alfredo":"Cook pasta. Warm butter, garlic and cream, then stir in Parmesan until smooth; toss with pasta.","salad bowl":"Combine greens, vegetables and your choice of protein. Add dressing just before serving.","mac & cheese":"Cook macaroni. Make a simple cheese sauce with butter, flour, milk and shredded cheese; combine and bake or serve creamy.","fried rice":"Chill cooked rice. Stir-fry rice with oil, egg, vegetables and soy sauce; add cooked chicken or shrimp if desired.","grilled cheese":"Butter bread, add cheese and cook in a skillet over medium-low heat until golden and melted.","burrito bowl":"Layer cooked rice, beans, seasoned protein, salsa and vegetables. Finish with cheese, avocado or sour cream.","southern vegetable plate":"Cook corn, green beans, cabbage or other vegetables until tender. Add potatoes or another starch and season with butter, salt and pepper.","meatloaf & mashed potatoes":"Mix ground beef, egg, breadcrumbs and onion. Shape and bake until cooked through; serve with mashed potatoes and gravy.","beef stroganoff":"Brown beef and onions. Add mushrooms and broth, then finish with sour cream; serve over egg noodles.","grilled salmon":"Season salmon with salt, pepper and lemon. Pan-sear or grill until flaky and serve with vegetables or rice.","lasagna":"Layer noodles, meat sauce, ricotta and mozzarella in a baking dish. Cover and bake until hot and bubbling.","chicken parmesan":"Bread chicken cutlets and brown them. Top with tomato sauce and mozzarella; bake until cheese melts and chicken is cooked through.","goulash":"Brown ground beef and onion. Add tomato sauce and diced tomatoes, then simmer and stir in cooked elbow macaroni.","santa fe soup":"Simmer beans, tomatoes, corn, chiles and chicken or beef with broth and Southwestern seasonings.","southern vegetable beef":"Brown beef, then simmer with tomatoes, potatoes, carrots and mixed vegetables in seasoned broth until tender.","chicken fried steak":"Tenderize cubed steak, bread it and fry until golden. Serve with cream gravy and a potato or vegetable.","country fried chicken":"Season and bread chicken, then fry until crisp and cooked through. Serve with gravy and Southern sides.","pot roast":"Brown a chuck roast. Slow-cook with onion, carrots, potatoes and broth until fork-tender.","chicken & dumplings":"Simmer chicken with onion and broth until tender. Drop biscuit-style dumplings into the simmering broth and cook until fluffy.","bbq pulled pork":"Season pork shoulder and cook low and slow until tender. Shred and toss with barbecue sauce.","bbq ribs":"Season ribs and cook low and slow until tender. Finish with barbecue sauce under high heat.","pork chops":"Season pork chops and pan-sear or grill until cooked through. Rest briefly before serving.","fried catfish":"Season catfish fillets, coat with seasoned cornmeal and fry until crisp and flaky.","shrimp & grits":"Cook creamy grits. Sauté seasoned shrimp with garlic and butter, then spoon over grits.","chili":"Brown beef with onion. Add beans, tomatoes and chili seasonings and simmer until thick.","chili cheese baked potato":"Bake a potato until tender. Split it open, top with chili and shredded cheese and return to heat until melted.","loaded baked potato":"Bake a potato until fluffy. Top with butter, cheese, sour cream, bacon and green onion.","mashed potatoes & gravy":"Boil potatoes until tender, mash with butter and milk. Serve with hot brown gravy.","biscuits & gravy":"Bake or warm biscuits. Make sausage gravy with browned sausage, flour and milk and spoon over biscuits.","buttermilk & cornbread":"Serve cold buttermilk with a warm slice of cornbread. For cornbread, mix cornmeal, egg, buttermilk, butter and salt and bake until browned.","sausage & peppers":"Brown sausage, then sauté sliced peppers and onions. Combine and simmer with a little tomato sauce if desired.","bacon & eggs":"Cook bacon until crisp. Fry or scramble eggs in the same skillet and season to taste.","chicken & waffles":"Cook crisp fried chicken tenders or chicken pieces. Serve over waffles with syrup or hot honey.","chicken tenders & fries":"Bread chicken strips and fry or air-fry until crisp. Serve with hot fries and dipping sauce.","sloppy joes & fries":"Brown ground beef and simmer with tomato sauce, ketchup, mustard and seasoning. Serve on buns with fries.","cabbage & sausage":"Brown sliced sausage. Add chopped cabbage and onion and cook until tender and lightly browned.","steak & potato":"Season steak and sear or grill to your preferred doneness. Serve with a baked or roasted potato.","potato soup":"Cook diced potatoes, onion and celery in broth until tender. Finish with milk or cream and season to taste.","beef stew":"Brown beef, then slow-cook with potatoes, carrots, onion and broth until tender and rich.","chicken noodle soup":"Simmer chicken, onion, carrots and celery in broth. Add noodles near the end and cook until tender.","chicken wings":"Season wings and bake, air-fry or fry until crisp and cooked through. Toss with buffalo sauce, barbecue sauce or seasoning.","meatball subs":"Bake or simmer meatballs in marinara. Fill toasted rolls with meatballs and mozzarella and broil until melted.","tuna melt":"Mix tuna with mayo and seasonings. Spread on bread with cheese and toast until the cheese melts.","philly cheesesteak":"Cook thin-sliced beef with onions. Pile into a toasted roll with melted provolone or American cheese.","peanut butter & jelly sandwich + chips":"Spread peanut butter and jelly on bread, close and slice. Serve with potato or tortilla chips.","ham sandwich + chips":"Layer ham, cheese, lettuce and condiments on bread. Toast if desired and serve with chips.","parfait":"Layer yogurt with fruit and granola. Chill until ready to serve.","smoothie":"Blend fruit with milk or yogurt and ice until smooth. Add honey or juice to taste.","gyro":"Warm a pita and fill with seasoned gyro meat, tomato, onion, lettuce and tzatziki.","bowl of cereal":"Pour cereal into a bowl and add cold milk. Add fruit if desired.","frozen dinner":"Follow the package directions for the frozen entrée. Remove film or vent the tray as directed, microwave until heated through, then let stand briefly before eating.","fish sticks":"Bake or air-fry frozen fish sticks until crisp and hot. Serve with tartar sauce and a side."};

var RECOVERED_FOODS=[
  ['Santa Fe Soup',['soup','mexican','beans','quick'],'santaFeSoup'],
  ['Chicken Fried Steak',['country','beef','comfort'],'chickenFriedSteak'],
  ['Country Fried Chicken',['country','chicken','comfort'],'countryFriedChicken'],
  ['Pot Roast',['beef','country','comfort','potato'],'potRoast'],
  ['BBQ Pulled Pork',['bbq','pork','quick'],'pulledPork'],
  ['BBQ Ribs',['bbq','pork','comfort'],'bbqRibs'],
  ['Pork Chops',['pork','country'],'porkChops'],
  ['Fried Catfish',['seafood','country','comfort'],'friedCatfish'],
  ['Shrimp & Grits',['seafood','country','comfort'],'shrimpGrits'],
  ['Chili',['beef','beans','soup','comfort'],'chili'],
  ['Chili Cheese Baked Potato',['beef','beans','comfort','quick','potato'],'chiliPotato'],
  ['Loaded Baked Potato',['vegetable','comfort','quick','potato'],'loadedBaked'],
  ['Mashed Potatoes & Gravy',['country','comfort','potato'],'mashedGravy'],
  ['Biscuits & Gravy',['country','breakfast','comfort'],'biscuitsGravy'],
  ['Sausage & Peppers',['pork','italian','quick'],'sausagePeppers'],
  ['Chicken & Waffles',['chicken','breakfast','comfort'],'chickenWaffles'],
  ['Meatball Subs',['beef','sandwich','italian','comfort'],'meatballSub'],
  ['Tuna Melt',['seafood','sandwich','quick','comfort'],'tunaMelt']
].map(function(x,i){return{id:'food-recovered-'+(i+1),name:x[0],tags:x[1],photo:x[2],type:'food'}});

Object.keys({
  santaFeSoup:1,
  chickenFriedSteak:1,
  countryFriedChicken:1,
  potRoast:1,
  pulledPork:1,
  bbqRibs:1,
  porkChops:1,
  friedCatfish:1,
  shrimpGrits:1,
  chili:1,
  chiliPotato:1,
  loadedBaked:1,
  mashedGravy:1,
  biscuitsGravy:1,
  sausagePeppers:1,
  chickenWaffles:1,
  meatballSub:1,
  tunaMelt:1
}).forEach(function(k){
  var urls={
    santaFeSoup:'https://images.pexels.com/photos/28286253/pexels-photo-28286253.jpeg?auto=compress&cs=tinysrgb&w=1400',
    chickenFriedSteak:'https://vinovoss.com/images/dishes/chicken-fried-steak_600px.webp?org_if_sml=1&q=85&w=1200',
    countryFriedChicken:'https://recipesclare.com/assets/images/1751102299554-1rk4gwow.webp',
    potRoast:'https://images.pexels.com/photos/6545671/pexels-photo-6545671.jpeg?auto=compress&cs=tinysrgb&w=1400',
    pulledPork:'https://www.ajsbbq.co.nz/assets/gallery-pulled-pork-DxzwwzGu.jpg',
    bbqRibs:'https://images.pexels.com/photos/1270276/pexels-photo-1270276.jpeg?auto=compress&cs=tinysrgb&w=1400',
    porkChops:'https://images.pexels.com/photos/332784/pexels-photo-332784.jpeg?auto=compress&cs=tinysrgb&w=1400',
    friedCatfish:'https://images.pexels.com/photos/29516766/pexels-photo-29516766.jpeg?auto=compress&cs=tinysrgb&w=1400',
    shrimpGrits:'https://southernbite.com/wp-content/uploads/2025/06/Shrimp-and-Grits-4-500x500.jpg',
    chili:'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/homemade_chili_con_carne.jpg',
    chiliPotato:'https://butterhearth.com/assets/images/1763506457858-ku289il9.webp',
    loadedBaked:'https://images.pexels.com/photos/13915036/pexels-photo-13915036.jpeg?auto=compress&cs=tinysrgb&w=1400',
    mashedGravy:'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/one_plate_coocked__potato_and_gravy.jpg',
    biscuitsGravy:'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/sausage_gravy.jpg',
    sausagePeppers:'https://www.pastapiracy.com/assets/images/simmering_sausage_peppers.png',
    chickenWaffles:'https://images.pexels.com/photos/31706937/pexels-photo-31706937.jpeg?auto=compress&cs=tinysrgb&w=1400',
    meatballSub:'https://bigbitesedenderry.com/img/gallery/7.jpg',
    tunaMelt:'https://kookycrunch.com/assets/images/1759837530030-r4i-jr61.webp'
  };
  var item=RECOVERED_FOODS.find(function(x){return x[2]===k});
  if(item)item.photo=urls[k];
});
RECOVERED_FOODS.forEach(function(f){if(!foods.some(function(x){return x.name.toLowerCase()===f.name.toLowerCase()}))foods.push(f)});

var FOOD_CUTS=[['Burgers','burger'],['Pizza','pizza'],['Chicken','chicken'],['Mexican','mexican'],['Italian','italian'],['Pasta','pasta'],['Potato','potato'],['Southern','southern'],['Healthy / Salad','healthy'],['Soup / Stew','soup'],['Sandwiches','sandwich'],['Seafood','seafood'],['Steak','steak'],['Breakfast','breakfast']];
var REST_CUTS=[['Fast Food','fast_food'],['Burgers','burger'],['Chicken','chicken'],['Wings','wings'],['Pizza','pizza'],['Mexican','mexican'],['Sandwiches','sandwich'],['Breakfast','breakfast'],['BBQ','bbq'],['Southern','southern'],['American','american'],['Seafood','seafood'],['Italian','italian'],['Chinese','chinese'],['Japanese','japanese'],['Thai','thai'],['Indian','indian'],['Mediterranean','mediterranean'],['Potato','potato'],['Healthy / Salad','healthy'],['Soup / Stew','soup'],['Steak','steak']];

var foodDeck=[],foodHeld=[],foodUndo=[],foodQuick=new Set(),foodHidden=new Set(load('foodHidden',[]));
var restaurants=[],restaurantHeld=[],restaurantUndo=[],restaurantQuick=new Set(),restaurantHidden=new Set(load('restaurantHidden',[]));
var restaurantQuery='',restaurantOpen=false,restaurantArea=null,restaurantSuggestToken=0,restaurantAbort=null,currentWinner=null,selectedMagicKey='';
var pass=null;

function $(id){return document.getElementById(id)}
function load(k,fb){try{return JSON.parse(localStorage.getItem('din_'+k)||JSON.stringify(fb))}catch(e){return fb}}
function save(k,v){try{localStorage.setItem('din_'+k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function foodTagMatch(f,k){
 var h=(f.name+' '+(f.tags||[]).join(' ')).toLowerCase();
 return {burger:/burger/,pizza:/pizza/,chicken:/chicken/,mexican:/mexican|taco|burrito/,italian:/italian|pasta|spaghetti|lasagna|alfredo/,pasta:/pasta|spaghetti|lasagna|alfredo/,potato:/potato|fries|tater/,southern:/southern|country|buttermilk/,healthy:/healthy|salad|vegetable|veggie|bowl/,soup:/soup|stew|chili|goulash/,sandwich:/sandwich|sub|cheesesteak|sloppy/,seafood:/seafood|fish|shrimp|salmon|catfish/,steak:/steak/,breakfast:/breakfast|eggs|bacon|waffles/,wings:/wings/}[k]?.test(h)||false;
}
function restTagMatch(r,k){
 var h=[r.name,r.brand,r.operator,r.category,r.cuisine,r.subcategory,r.amenity].concat(r.tags||[]).filter(Boolean).join(' ').toLowerCase().replace(/[’']/g,"'");
 return {burger:/burger/,pizza:/pizza|pizzeria/,chicken:/chicken/,mexican:/mexican|taco|burrito|tex[- ]mex/,italian:/italian|pasta|trattoria/,potato:/potato|fries|tater/,southern:/southern|soul food|country cooking/,healthy:/healthy|salad|grain bowl|green bowl/,soup:/soup|stew|chowder|chili|goulash/,sandwich:/sandwich|sub|deli|hoagie|cheesesteak/,seafood:/seafood|fish|shrimp|crab|catfish|salmon/,steak:/steak|steakhouse/,breakfast:/breakfast|brunch|waffle|pancake|egg/,wings:/wings/,fast_food:/fast[ -]?food|fast_food|mcdonald'?s|wendy'?s|burger king|taco bell|kfc|chick[- ]?fil[- ]?a|popeyes|subway|sonic|arby'?s|five guys|wingstop/,bbq:/bbq|barbecue|smokehouse/,american:/american|waffle house|applebee'?s|denny'?s|ihop|cracker barrel|chili'?s|perkins|bob evans|texas roadhouse|longhorn steakhouse|outback steakhouse/,chinese:/chinese|dim sum|sichuan|hunan|cantonese/,japanese:/japanese|sushi/,thai:/thai/,indian:/indian/,mediterranean:/mediterranean|gyro|falafel/}[k]?.test(h)||false;
}
function hungryArt(){
 return '<div class="nochoice-art" aria-hidden="true"><svg viewBox="0 0 240 150" role="img"><ellipse cx="120" cy="124" rx="72" ry="11" fill="rgba(255,255,255,.08)"/><circle cx="120" cy="83" r="53" fill="#f7f2e9" stroke="#d8d0c2" stroke-width="7"/><circle cx="120" cy="83" r="31" fill="#e9e2d7"/><path d="M91 40V16M103 40V12M115 40V16M97 40V58" stroke="#f7f2e9" stroke-width="5" stroke-linecap="round"/><path d="M149 12v48M162 12v48M155 60v51" stroke="#f7f2e9" stroke-width="5" stroke-linecap="round"/><path d="M91 91c8 6 18 9 29 9s21-3 29-9" fill="none" stroke="#8a7765" stroke-width="4" stroke-linecap="round"/><circle cx="107" cy="78" r="3" fill="#8a7765"/><circle cx="133" cy="78" r="3" fill="#8a7765"/></svg></div>';
}
function show(view){document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active')});$(view).classList.add('active')}
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5})}
function foodEligible(){return foodDeck.filter(function(f){return !foodHeld.some(function(h){return h.id===f.id})&&!foodHidden.has(f.name)&&![].concat(Array.from(foodQuick)).some(function(k){return foodTagMatch(f,k)})})}
function restEligible(){var a=restaurants.filter(function(r){return !restaurantHeld.some(function(h){return h.id===r.id})&&!restaurantHidden.has(rKey(r))&&![].concat(Array.from(restaurantQuick)).every(function(k){return !restTagMatch(r,k)})&&(!restaurantOpen || (r.openNow === true || r.open === true || (r.openNow == null && r.open !== false)))});var q=restaurantQuery.trim().toLowerCase();if(q)a=a.filter(function(r){return (r.name+' '+(r.address||'')+' '+(r.brand||'')+' '+(r.operator||'')+' '+(r.cuisine||'')).toLowerCase().indexOf(q)>=0});return a}
function rKey(r){return String(r.id||r.name||'').toLowerCase()}
function isSaved(x){return load('saved',[]).some(function(v){return String(v.id||v.name)===String(x.id||x.name)})}
function toggleSaved(x,btn){var a=load('saved',[]),k=String(x.id||x.name);a=isSaved(x)?a.filter(function(v){return String(v.id||v.name)!==k}):[x].concat(a).slice(0,100);save('saved',a);btn.textContent=isSaved(x)?'♥ Saved':'♡ Save'}
function recordHistory(x,type){var h=load('history',[]);h.unshift({id:x.id,name:x.name,type:type,date:Date.now(),photo:x.photo||'',address:x.address||''});save('history',h.slice(0,100))}
function openSheet(title,body,actions){$('modal').classList.remove('hidden');$('sheet').innerHTML='<h2>'+esc(title)+'</h2>'+body+'<div class="sheet-actions">'+actions+'</div>'}
function closeSheet(){$('modal').classList.add('hidden')}
function confirmBox(title,msg,ok){openSheet(title,'<p class="modal-copy">'+esc(msg)+'</p>','<button id="mCancel">Cancel</button><button id="mOk" class="primary">Confirm</button>');$('mCancel').onclick=closeSheet;$('mOk').onclick=function(){closeSheet();ok()}}
function saveFoodRound(){save('foodRound',{deck:foodDeck,held:foodHeld,quick:Array.from(foodQuick),savedAt:Date.now()})}
function saveRestaurantRound(){save('restaurantRound',{rows:restaurants,held:restaurantHeld,quick:Array.from(restaurantQuick),query:restaurantQuery,open:restaurantOpen,area:restaurantArea,savedAt:Date.now()})}
function clearFoodRound(){try{localStorage.removeItem('din_foodRound')}catch(e){}}
function clearRestaurantRound(){try{localStorage.removeItem('din_restaurantRound')}catch(e){}}
function restoreRestaurantRound(){
 var saved=load('restaurantRound',null);
 if(!saved||!Array.isArray(saved.rows)||!saved.rows.length|| (saved.savedAt&&Date.now()-Number(saved.savedAt)>86400000)) return false;
 restaurants=saved.rows;restaurantHeld=Array.isArray(saved.held)?saved.held:[];restaurantUndo=[];restaurantQuick=new Set(Array.isArray(saved.quick)?saved.quick:[]);restaurantQuery=String(saved.query||'');restaurantOpen=!!saved.open;$('restQuery').value=restaurantQuery;restaurantArea=saved.area||null;return true;
}
function startRestaurants(fresh){
 if(!fresh&&!restoreRestaurantRound()){restaurants=[];restaurantHeld=[];restaurantUndo=[];restaurantQuick.clear();restaurantQuery='';restaurantOpen=false;restaurantArea=null;$('restQuery').value='';}
 show('restaurantView');syncRestTools();renderRestaurant();
}
function startFood(fresh){var saved=!fresh?load('foodRound',null):null;foodUndo=[];if(saved&&Array.isArray(saved.deck)&&saved.deck.length&&(!saved.savedAt||Date.now()-Number(saved.savedAt)<86400000)){foodDeck=saved.deck;foodHeld=Array.isArray(saved.held)?saved.held:[];foodQuick=new Set(Array.isArray(saved.quick)?saved.quick:[])}else{foodDeck=foods.filter(function(x){return !foodHidden.has(x.name)});foodHeld=[];foodQuick.clear()}show('foodView');renderFood();if(!fresh)saveFoodRound()} 
function pushFood(){foodUndo.push({deck:foodDeck.map(function(x){return Object.assign({},x)}),held:foodHeld.map(function(x){return Object.assign({},x)}),quick:Array.from(foodQuick)});if(foodUndo.length>30)foodUndo.shift()}
function finishMaybeFood(f){var a=foodEligible();if(a.length===1&&a[0].id===f.id){winner(f,'food');return true}return false}
function cutFood(){var f=foodEligible()[0];if(!f)return;pushFood();foodDeck=foodDeck.filter(function(x){return x.id!==f.id});if(!foodEligible().length&&foodHeld.length){foodDeck=foodHeld;foodHeld=[]}saveFoodRound();renderFood()}
function maybeFood(){var f=foodEligible()[0];if(!f)return;if(finishMaybeFood(f))return;pushFood();foodHeld.push(f);foodDeck=foodDeck.filter(function(x){return x.id!==f.id});if(!foodEligible().length&&foodHeld.length){foodDeck=foodHeld;foodHeld=[]}saveFoodRound();renderFood()}
function undoFood(){var s=foodUndo.pop();if(!s)return;foodDeck=s.deck;foodHeld=s.held;foodQuick=new Set(s.quick);saveFoodRound();renderFood()}
function hideFood(){var f=foodEligible()[0];if(!f)return;confirmBox('Hide this food?',"You won't see "+f.name+" again until restored in Settings.",function(){foodHidden.add(f.name);save('foodHidden',Array.from(foodHidden));foodDeck=foodDeck.filter(function(x){return x.id!==f.id});saveFoodRound();renderFood()})}
function renderFoodQuick(){var h=$('foodQuick');h.innerHTML=FOOD_CUTS.map(function(v){var label=v[0],k=v[1],n=foods.filter(function(f){return foodTagMatch(f,k)&&!foodHidden.has(f.name)}).length,on=foodQuick.has(k),f=foods.find(function(x){return foodTagMatch(x,k)})||foods[0];return '<button class="quickbtn '+(on?'on':'')+'" data-fq="'+k+'" type="button"'+(!n&&!on?' disabled':'')+'><span class="qphoto" style="background-image:url(\''+esc(f.photo)+'\')"></span><span class="qshade"></span><strong>'+esc(label)+'</strong><em>'+(on?'show':'hide')+' · '+n+'</em></button>'}).join('');h.querySelectorAll('[data-fq]').forEach(function(b){b.onclick=function(){foodQuick.has(b.dataset.fq)?foodQuick.delete(b.dataset.fq):foodQuick.add(b.dataset.fq);saveFoodRound();renderFood()}})}
function renderFood(){
 show('foodView');var a=foodEligible(),stage=$('foodStage');$('foodCount').textContent=a.length+' left';renderFoodQuick();
 if(!a.length){var exhausted=!foodDeck.length&&!foodHeld.length;stage.innerHTML='<div class="empty '+(exhausted?'nochoice':'')+'">'+(exhausted?hungryArt():'')+'<h2>'+(exhausted?'We cut them all.':'No food choices')+'</h2><p>'+(exhausted?'Dinner won’t choose itself. Start a new round and try again.':'Turn a Quick Cut back on, or start over.')+'</p><button id="foodRestart" class="emptybtn">Start over</button></div>';setActions(false,'food');$('foodRestart').onclick=function(){startFood(true)};return}
 var f=a[0];
 stage.innerHTML='<article class="card" id="foodCard"><div class="photo"><img src="'+esc(f.photo||PHOTO.burger)+'" alt="'+esc(f.name)+'" onerror="this.style.display=none"><span class="pill">DINNER</span><span class="swipe left">CUT</span><span class="swipe right">MAYBE</span></div><div class="cardbody"><div class="kicker">Tonight’s option</div><div class="cardname">'+esc(f.name)+'</div><div class="meta">'+esc((f.tags||[]).filter(function(t){return t!=='quick'}).slice(0,4).join(' · '))+'</div><div class="cardfoot"><span>'+a.length+' options left</span><div><button id="foodDetails" class="minor">Details</button><button id="foodSave" class="minor">'+(isSaved(f)?'♥ Saved':'♡ Save')+'</button></div></div></div></article>';
 bindSwipe($('foodCard'),'food');$('foodCut').onclick=function(){if(!passAwareCut('food'))cutFood()};$('foodMaybe').onclick=function(){if(!passAwareMaybe('food'))maybeFood()};$('foodBack').onclick=undoFood;$('foodHide').onclick=hideFood;$('foodDetails').onclick=function(){details(f)};$('foodSave').onclick=function(){toggleSaved(f,$('foodSave'))};setActions(true,'food')
}
function randomFood(){var a=foodEligible();if(a.length<2)return;var i=Math.floor(Math.random()*a.length);pushFood();foodDeck=foodDeck.filter(function(x){return x.id!==a[i].id});saveFoodRound();renderFood()}
function restaurantPhoto(r){return r.photo||r.photoUrl||r.image||r.imageUrl||(r.photoName?(API+'?mode=photo&name='+encodeURIComponent(r.photoName)):PHOTO.restaurant)}
function pushRestaurant(){restaurantUndo.push({rows:restaurants.map(function(x){return Object.assign({},x)}),held:restaurantHeld.map(function(x){return Object.assign({},x)}),quick:Array.from(restaurantQuick),query:restaurantQuery,open:restaurantOpen});if(restaurantUndo.length>30)restaurantUndo.shift()}
function cutRestaurant(){var r=restEligible()[0];if(!r)return;if(restEligible().length===1){winner(r,'restaurant');return}pushRestaurant();restaurants=restaurants.filter(function(x){return rKey(x)!==rKey(r)});if(!restEligible().length&&restaurantHeld.length){restaurants=restaurantHeld;restaurantHeld=[]}saveRestaurantRound();renderRestaurant()}
function maybeRestaurant(){var r=restEligible()[0];if(!r)return;if(restEligible().length===1){winner(r,'restaurant');return}pushRestaurant();restaurantHeld.push(r);restaurants=restaurants.filter(function(x){return rKey(x)!==rKey(r)});if(!restEligible().length&&restaurantHeld.length){restaurants=restaurantHeld;restaurantHeld=[]}saveRestaurantRound();renderRestaurant()}
function undoRestaurant(){var s=restaurantUndo.pop();if(!s)return;restaurants=s.rows;restaurantHeld=s.held;restaurantQuick=new Set(s.quick);restaurantQuery=s.query;restaurantOpen=s.open;$('restQuery').value=restaurantQuery;syncRestTools();saveRestaurantRound();renderRestaurant()}
function hideRestaurant(){var r=restEligible()[0];if(!r)return;confirmBox('Hide this restaurant',"You won't see "+r.name+" again until restored in Settings.",function(){restaurantHidden.add(rKey(r));save('restaurantHidden',Array.from(restaurantHidden));restaurants=restaurants.filter(function(x){return rKey(x)!==rKey(r)});saveRestaurantRound();renderRestaurant()})}
function renderRestaurantQuick(){var h=$('restaurantQuick');h.innerHTML=REST_CUTS.map(function(v){var label=v[0],k=v[1],n=restaurants.filter(function(r){return restTagMatch(r,k)}).length,on=restaurantQuick.has(k),p=k==='fast_food'||k==='burger'?PHOTO.burger:k==='pizza'?PHOTO.pizza:k==='chicken'||k==='wings'?PHOTO.wings:k==='mexican'?PHOTO.tacos:k==='italian'?PHOTO.pasta:k==='seafood'?PHOTO.salmon:k==='breakfast'?PHOTO.baconEggs:PHOTO.steak;return '<button class="quickbtn '+(on?'on':'')+'" data-rq="'+k+'" type="button"'+(!n&&!on?' disabled':'')+'><span class="qphoto" style="background-image:url(\''+esc(p)+'\')"></span><span class="qshade"></span><strong>'+esc(label)+'</strong><em>'+(on?'show':'hide')+' · '+n+'</em></button>'}).join('');h.querySelectorAll('[data-rq]').forEach(function(b){b.onclick=function(){restaurantQuick.has(b.dataset.rq)?restaurantQuick.delete(b.dataset.rq):restaurantQuick.add(b.dataset.rq);saveRestaurantRound();renderRestaurant()}})}
function renderRestaurant(){
 show('restaurantView');var a=restEligible(),stage=$('restaurantStage');$('restaurantCount').textContent=a.length+' left';renderRestaurantQuick();
 if(!a.length){var exhausted=!!restaurantArea&&!restaurants.length;stage.innerHTML=exhausted?'<div class="empty nochoice">'+hungryArt()+'<h2>We cut them all.</h2><p>Even dinner is out of ideas. Start a new round.</p><button id="emptyRestart" class="emptybtn">Start over</button></div>':restaurants.length?'<div class="empty"><h2>No restaurant matches</h2><p>Turn a Quick Cut back on, clear Search, or try another location.</p><button id="clearRest" class="emptybtn">Clear filters</button></div>':'<div class="empty"><h2>Ready to find dinner?</h2><p>Use your current location or enter another address.</p><div class="emptyrow"><button id="emptyFind" class="emptybtn">Find restaurants</button><button id="emptyLocate" class="emptybtn">Use my location</button></div></div>'; $('clearRest')?.addEventListener('click',function(){restaurantQuick.clear();restaurantQuery='';$('restQuery').value='';restaurantOpen=false;syncRestTools();renderRestaurant()});$('emptyFind')?.addEventListener('click',findRestaurants);$('emptyLocate')?.addEventListener('click',useLocation);$('emptyRestart')?.addEventListener('click',function(){startRestaurants(true)});setActions(false,'restaurant');return}
 var r=a[0],photo=restaurantPhoto(r),img=photo?'<img src="'+esc(photo)+'" alt="'+esc(r.name)+' restaurant" onerror="this.style.display=none">':'';var site=r.website?'<a href="'+esc(r.website)+'" target="_blank" rel="noopener noreferrer">Website / Order</a>':'<button id="restaurantSearchWeb">Search / Order</button>';
 stage.innerHTML='<article class="card restcard" id="restaurantCard"><div class="photo">'+img+'<span class="pill">'+(r.fastFood?'FAST FOOD':'RESTAURANT')+'</span><span class="swipe left">CUT</span><span class="swipe right">MAYBE</span></div><div class="cardbody"><div class="kicker">'+esc(r.cuisine||r.category||'Restaurant')+'</div><div class="cardname">'+esc(r.name)+'</div><div class="meta">'+esc((r.openNow===true||r.open===true?'Open now':(r.openNow===false||r.open===false?'Closed':'Open / unknown hours'))+' · '+(Number.isFinite(Number(r.distanceMiles))?Number(r.distanceMiles).toFixed(1)+' mi':'Distance unavailable'))+'<br>'+esc(r.address||'Nearby restaurant')+'</div><div class="links">'+site+'<button id="restaurantDetails" class="minor">Details</button><button id="restaurantSave" class="minor">'+(isSaved(r)?'♥ Saved':'♡ Save')+'</button></div></div></article>';
 bindSwipe($('restaurantCard'),'restaurant');$('restaurantCut').onclick=function(){if(!passAwareCut('restaurant'))cutRestaurant()};$('restaurantMaybe').onclick=function(){if(!passAwareMaybe('restaurant'))maybeRestaurant()};$('restaurantBack').onclick=undoRestaurant;$('restaurantHide').onclick=hideRestaurant;$('restaurantDetails').onclick=function(){details(r)};$('restaurantSave').onclick=function(){toggleSaved(r,$('restaurantSave'))};$('restaurantSearchWeb')?.addEventListener('click',function(){window.open('https://www.google.com/search?q='+encodeURIComponent(r.name),'_blank','noopener,noreferrer')});setActions(true,'restaurant')
}
function bindSwipe(card,type){
 var active=false,id=null,sx=0,sy=0,moved=false;
 function cleanup(pointerId){active=false;id=null;card.classList.remove('dragging','dragcut','dragmaybe');card.style.removeProperty('transform');try{if(pointerId!=null)card.releasePointerCapture(pointerId)}catch{}}
 card.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;var t=e.target;if(t&&t.closest&&t.closest('button,a'))return;if(type==='food'?!foodEligible()[0]:!restEligible()[0])return;active=true;id=e.pointerId;sx=e.clientX;sy=e.clientY;moved=false;card.classList.add('dragging');try{card.setPointerCapture(id)}catch{}},{passive:false});
 card.addEventListener('pointermove',function(e){if(!active||e.pointerId!==id)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dy)>Math.abs(dx)*1.15&&Math.abs(dy)>12){cleanup(e.pointerId);return}if(Math.abs(dx)>6)moved=true;if(e.cancelable)e.preventDefault();var clamped=Math.max(-360,Math.min(360,dx));card.style.transform='translate3d('+clamped+'px,'+Math.max(-14,Math.min(14,dy*.05))+'px,0) rotate('+(clamped*.045)+'deg)';card.classList.toggle('dragcut',clamped<-48);card.classList.toggle('dragmaybe',clamped>48)},{passive:false});
 card.addEventListener('pointerup',function(e){if(!active||e.pointerId!==id)return;var dx=e.clientX-sx;var shouldAct=moved&&Math.abs(dx)>=54;cleanup(e.pointerId);if(!shouldAct)return;if(type==='food'){if(dx<0){if(!passAwareCut('food'))cutFood()}else{if(!passAwareMaybe('food'))maybeFood()}}else{if(dx<0){if(!passAwareCut('restaurant'))cutRestaurant()}else{if(!passAwareMaybe('restaurant'))maybeRestaurant()}}},{passive:false});
 card.addEventListener('pointercancel',function(e){if(e.pointerId===id)cleanup(e.pointerId)},{passive:false});
 card.addEventListener('lostpointercapture',function(e){if(active&&e.pointerId===id)cleanup(e.pointerId)},{passive:false});
}
function setActions(enabled,type){var ids=type==='food'?['foodHide','foodBack','foodCut','foodMaybe']:['restaurantHide','restaurantBack','restaurantCut','restaurantMaybe'];ids.forEach(function(id){$(id).disabled=!enabled})}
function status(msg,warn){$('restaurantStatus').textContent=msg||'';$('restaurantStatus').classList.toggle('warn',!!warn)}
async function api(params,timeout){if(restaurantAbort)try{restaurantAbort.abort()}catch{}var ctl=new AbortController();restaurantAbort=ctl;var timer=setTimeout(function(){ctl.abort()},timeout||16000);try{var res=await fetch(API+'?'+new URLSearchParams(params),{credentials:'same-origin',headers:{Accept:'application/json'},signal:ctl.signal});var d=await res.json().catch(function(){return{}});if(!res.ok)throw new Error(d.message||'Restaurant search failed.');return d}finally{clearTimeout(timer);if(restaurantAbort===ctl)restaurantAbort=null}}
function showSuggestions(rows){var h=$('suggestions');if(!rows||!rows.length){h.classList.add('hidden');h.innerHTML='';return}h.innerHTML=rows.map(function(r,i){return'<button class="suggestion" data-s="'+i+'" type="button"><b>'+esc(r.display)+'</b><span>'+esc(r.source==='ArcGIS'?'Exact address suggestion':'Address / area match')+'</span></button>'}).join('');h.classList.remove('hidden');h.querySelectorAll('[data-s]').forEach(function(b){b.onclick=async function(){var r=rows[Number(b.dataset.s)];$('restaurantLocation').value=r.query||r.display;selectedMagicKey=r.magicKey||'';h.classList.add('hidden');try{var p=(Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lon)))?{lat:Number(r.lat),lon:Number(r.lon),display:r.display}:await resolveLocation(r.query||r.display,r.magicKey||'');restaurantArea=p;await loadRestaurants(p.lat,p.lon,p.display)}catch(e){status(e.message||'That address could not be used.',true)}}})}
async function suggest(q){var my=++restaurantSuggestToken;if(q.trim().length<2){showSuggestions([]);return}setTimeout(async function(){if(my!==restaurantSuggestToken)return;try{var d=await api({mode:'suggest',q:q.trim(),limit:7},10000);if(my===restaurantSuggestToken)showSuggestions(d.results||[])}catch(e){showSuggestions([])}},180)}
async function resolveLocation(q,magicKey){var d=await api({mode:'resolve',q:q,magicKey:magicKey||''},10000),l=d.location||{};if(!Number.isFinite(Number(l.lat))||!Number.isFinite(Number(l.lon)))throw new Error('That address did not return usable coordinates.');return{lat:Number(l.lat),lon:Number(l.lon),display:d.display||q}}
function dedupeRestaurants(rows){var seen=new Set();return rows.filter(function(r){var k=String(r.id||r.placeId||((r.name||'')+'|'+(r.address||'')+'|'+r.lat+'|'+r.lon)).toLowerCase();if(seen.has(k))return false;seen.add(k);return true})}
async function loadRestaurants(lat,lon,label){var prior=restaurants.slice();status('Finding restaurants near '+label+'…');try{var d=await api({mode:'search',lat:lat,lon:lon,radius:Number($('restaurantRadius').value)||10,limit:500},26000);var rows=Array.isArray(d.results)?d.results:[];if(!rows.length){restaurants=[];renderRestaurant();status('No restaurants were found in that area.',true);return false}restaurants=dedupeRestaurants(rows).map(function(r){return Object.assign({},r,{open:(typeof r.open==='boolean'?r.open:(typeof r.openNow==='boolean'?r.openNow:undefined))})}).filter(function(r){return !restaurantHidden.has(rKey(r))});restaurantHeld=[];restaurantUndo=[];restaurantQuick.clear();restaurantQuery='';$('restQuery').value='';syncRestTools();saveRestaurantRound();status(restaurants.length+' restaurants · '+(Number(d.fastFoodCount)||0)+' fast food · '+(Number(d.radiusMiles)||10)+' mi');renderRestaurant();return true}catch(e){restaurants=prior;renderRestaurant();status(e&&e.message?e.message:'Couldn’t complete the restaurant search. Try again.',true);return false}}
async function findRestaurants(){var q=$('restaurantLocation').value.trim();$('suggestions').classList.add('hidden');if(!q){status('Enter a city, ZIP, or street address.',true);return}try{status('Locating '+q+'…');var p=await resolveLocation(q,selectedMagicKey);selectedMagicKey='';restaurantArea=p;await loadRestaurants(p.lat,p.lon,p.display)}catch(e){selectedMagicKey='';status(e.message||'That location could not be found.',true)}}
function useLocation(){selectedMagicKey='';restaurantSuggestToken++;showSuggestions([]);if(!navigator.geolocation){status('Location services are unavailable. Enter an address instead.',true);return}status('Getting your current location…');navigator.geolocation.getCurrentPosition(async function(pos){try{var lat=Number(pos.coords.latitude),lon=Number(pos.coords.longitude);restaurantArea={lat:lat,lon:lon,display:'Your location'};$('restaurantLocation').value='';await loadRestaurants(lat,lon,'your location')}catch(e){status(e.message||'Could not load restaurants.',true)}},function(err){status(err.code===1?'Location permission was denied. Enter an address instead.':err.code===2?'Your location could not be determined. Enter an address instead.':'Location lookup timed out. Enter an address instead.',true)},{enableHighAccuracy:true,timeout:10000,maximumAge:0})}
function syncRestTools(){$('openUnknownBtn').classList.toggle('on',restaurantOpen);$('openUnknownBtn').setAttribute('aria-pressed',String(restaurantOpen));$('restaurantSearchBtn').setAttribute('aria-expanded',String($('restSearch').classList.contains('open')));$('restSearch').classList.toggle('open',!!restaurantQuery)}
function details(x){
 var body='';
 if(x.type==='restaurant'){
   body='<p class="modal-copy">'+esc(x.address||'Nearby restaurant')+'</p>';
   if(x.cuisine)body+='<p class="modal-copy"><strong>Cuisine:</strong> '+esc(x.cuisine)+'</p>';
   if(x.opening_hours)body+='<p class="modal-copy"><strong>Hours:</strong> '+esc(x.opening_hours)+'</p>';
   if(x.menuItems&&x.menuItems.length)body+='<p class="modal-copy"><strong>Common menu items:</strong> '+esc(x.menuItems.slice(0,8).join(' · '))+'</p>';
 } else {
   var key=String(x.name||'').toLowerCase(),recipe=FOOD_RECIPES[key]||x.notes||'';
   body='<p class="modal-copy"><strong>Style:</strong> '+esc((x.tags||[]).filter(function(t){return t!=='quick'&&t!=='home'}).slice(0,6).join(' · ')||'Everyday dinner choice')+'</p>';
   if(recipe)body+='<div class="detail-recipe"><div class="detail-recipe-title">Details</div><p>'+esc(recipe)+'</p></div>';
   else body+='<p class="modal-copy">Food details can be customized from Add Food.</p>';
 }
 openSheet(x.name,body,'<button id="detailClose">Close</button>'+(x.type==='restaurant'&&x.website?'<a class="primary linkbtn" href="'+esc(x.website)+'" target="_blank" rel="noopener noreferrer">Website / Order</a>':''));
 $('detailClose').onclick=closeSheet;
}
function winner(x,type){currentWinner=x;recordHistory(x,type);if(type==='food')clearFoodRound();else clearRestaurantRound();show('winnerView');$('winnerBody').innerHTML='<div class="winner"><div class="eyebrow">TONIGHT’S DECISION</div><h1>'+esc(x.name)+'</h1><p>'+esc(type==='restaurant'?(x.address||'Restaurant'):((x.tags||[]).slice(0,4).join(' · ')))+'</p></div>';$('winnerHome').onclick=function(){show('homeView');currentWinner=null};$('winnerDetails').onclick=function(){details(x)};$('winnerShare').onclick=function(){var text='Tonight: '+x.name+(type==='restaurant'&&x.address?' · '+x.address:'');if(navigator.share)navigator.share({title:'Dinliminate',text:text}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(text).then(function(){status('Decision copied to clipboard.')}).catch(function(){});}}
function openAddFood(){openSheet('Add Food','<label>Name<input id="newFoodName" maxlength="80"></label><label>Tags<input id="newFoodTags" placeholder="Southern, comfort, quick"></label><label>Photo URL<input id="newFoodPhoto" placeholder="https://..."></label><label>Notes<textarea id="newFoodNotes"></textarea></label>','<button id="addCancel">Cancel</button><button id="addSave" class="primary">Add Food</button>');$('addCancel').onclick=closeSheet;$('addSave').onclick=function(){var n=$('newFoodName').value.trim();if(!n)return;var f={id:'custom-'+Date.now(),name:n,tags:$('newFoodTags').value.split(',').map(function(x){return x.trim().toLowerCase()}).filter(Boolean),photo:$('newFoodPhoto').value.trim()||PHOTO.burger,type:'food',notes:$('newFoodNotes').value.trim()};var a=load('custom',[]);a.push(f);save('custom',a);foods.push(f);closeSheet();startFood()}}
var historyMonth=new Date(); historyMonth.setDate(1);
function dayKey(dt){var y=dt.getFullYear(),m=String(dt.getMonth()+1).padStart(2,'0'),d=String(dt.getDate()).padStart(2,'0');return y+'-'+m+'-'+d}
function historyForDay(key){return load('history',[]).filter(function(x){var d=new Date(x.date);return dayKey(d)===key})}
function renderHistory(){
 var h=load('history',[]),y=historyMonth.getFullYear(),m=historyMonth.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
 var start=new Date(first);start.setDate(1-first.getDay());
 var end=new Date(last);end.setDate(last.getDate()+(6-last.getDay()));
 var monthName=historyMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 var html='<div class="history-calendar"><div class="history-cal-head"><button id="histPrev" type="button">‹</button><strong>'+esc(monthName)+'</strong><button id="histNext" type="button">›</button></div><div class="history-weekdays">'+['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function(x){return'<span>'+x+'</span>'}).join('')+'</div><div class="history-grid">';
 var cur=new Date(start);
 while(cur<=end){
   var key=dayKey(cur),events=historyForDay(key),outside=cur.getMonth()!==m,today=key===dayKey(new Date());
   html+='<div class="history-day '+(outside?'outside ':'')+(today?'today ':'')+'" data-history-day="'+key+'"><span class="history-day-num">'+cur.getDate()+'</span>';
   if(events.length){
     var e=events[0];
     html+='<div class="history-event" title="'+esc(e.name)+'"><img src="'+esc(e.photo||PHOTO.burger)+'" alt=""><span>'+esc(e.name)+'</span>'+(events.length>1?'<em>+'+(events.length-1)+'</em>':'')+'<button class="history-x" data-history-x="'+key+'" data-history-index="0" aria-label="Remove '+esc(e.name)+'">×</button></div>';
   }
   html+='</div>';
   cur.setDate(cur.getDate()+1);
 }
 html+='</div><div class="history-list">';
 if(h.length){
   html+=h.slice(0,12).map(function(x,i){return'<div class="history-row"><img src="'+esc(x.photo||PHOTO.burger)+'" alt=""><div><b>'+esc(x.name)+'</b><span>'+new Date(x.date).toLocaleDateString()+' · '+esc(x.type)+'</span></div><button class="history-x history-list-x" data-history-list-index="'+i+'" aria-label="Remove '+esc(x.name)+'">×</button></div>'}).join('');
 }else html+='<p class="modal-copy">No decisions yet.</p>';
 html+='</div></div>';
 $('sheet').innerHTML='<h2>History</h2>'+html+'<div class="sheet-actions"><button id="historyClose">Close</button></div>';
 $('histPrev').onclick=function(){historyMonth.setMonth(historyMonth.getMonth()-1);renderHistory()};
 $('histNext').onclick=function(){historyMonth.setMonth(historyMonth.getMonth()+1);renderHistory()};
 document.querySelectorAll('[data-history-day]').forEach(function(el){el.addEventListener('click',function(e){if(e.target.closest('.history-x'))return;var events=historyForDay(el.dataset.historyDay);if(events.length){openSheet('History · '+new Date(el.dataset.historyDay+'T12:00:00').toLocaleDateString(),events.map(function(x){return'<div class="history-row"><img src="'+esc(x.photo||PHOTO.burger)+'" alt=""><div><b>'+esc(x.name)+'</b><span>'+esc(x.type)+'</span></div></div>'}).join(''),'<button id="dayClose">Close</button>');$('dayClose').onclick=closeSheet}})});
 document.querySelectorAll('[data-history-x]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var rows=load('history',[]),key=b.dataset.historyX;var matches=rows.map(function(x,i){return{idx:i,key:dayKey(new Date(x.date))}}).filter(function(x){return x.key===key});if(matches.length){rows.splice(matches[0].idx,1);save('history',rows);renderHistory()}}});
 document.querySelectorAll('[data-history-list-index]').forEach(function(b){b.onclick=function(){var rows=load('history',[]);rows.splice(Number(b.dataset.historyListIndex),1);save('history',rows);renderHistory()}});
 $('historyClose').onclick=closeSheet;
}
function openHistory(){ $('modal').classList.remove('hidden'); renderHistory(); }
function deleteCustomFood(id){
 var custom=load('custom',[]),item=custom.find(function(x){return String(x.id)===String(id)});if(!item)return;
 confirmBox('Delete this food?',item.name+' will be permanently removed from your custom foods.',function(){
   save('custom',custom.filter(function(x){return String(x.id)!==String(id)}));
   foods=foods.filter(function(x){return String(x.id)!==String(id)});
   closeSheet();startFood(true);
 });
}
function openSettings(){
 var hiddenFood=Array.from(foodHidden),hiddenRest=Array.from(restaurantHidden),custom=load('custom',[]);
 var html='<p class="modal-copy">Hidden choices stay hidden until restored here.</p>';
 html+='<div class="settings-section"><h3>Hidden foods</h3>';
 html+=hiddenFood.length?hiddenFood.map(function(name){return'<div class="settings-row"><div><strong>'+esc(name)+'</strong><span>Hidden from food rounds</span></div><button data-unhide-food="'+esc(name)+'" type="button">Bring back</button></div>'}).join(''):'<p class="modal-copy">None hidden.</p>';
 html+='</div><div class="settings-section"><h3>Hidden restaurants</h3>';
 html+=hiddenRest.length?hiddenRest.map(function(name){return'<div class="settings-row"><div><strong>'+esc(name)+'</strong><span>Hidden from restaurant rounds</span></div><button data-unhide-rest="'+esc(name)+'" type="button">Bring back</button></div>'}).join(''):'<p class="modal-copy">None hidden.</p>';
 html+='</div><div class="settings-section"><h3>Your foods</h3>';
 html+=custom.length?custom.map(function(x){return'<div class="settings-row"><div><strong>'+esc(x.name)+'</strong><span>Custom food</span></div><button class="danger-mini" data-delete-custom="'+esc(x.id)+'" type="button">Delete food</button></div>'}).join(''):'<p class="modal-copy">No custom foods yet.</p>';
 html+='</div>';
 openSheet('Settings',html,'<button id="settingsClose">Close</button><button id="systemRestore" class="primary">System Restore</button>');
 document.querySelectorAll('[data-unhide-food]').forEach(function(b){b.onclick=function(){foodHidden.delete(b.dataset.unhideFood);save('foodHidden',Array.from(foodHidden));openSettings()}});
 document.querySelectorAll('[data-unhide-rest]').forEach(function(b){b.onclick=function(){restaurantHidden.delete(b.dataset.unhideRest);save('restaurantHidden',Array.from(restaurantHidden));openSettings()}});
 document.querySelectorAll('[data-delete-custom]').forEach(function(b){b.onclick=function(){deleteCustomFood(b.dataset.deleteCustom)}});
 $('settingsClose').onclick=closeSheet;
 $('systemRestore').onclick=function(){confirmBox('System Restore?','Restore the default food list, hidden choices, and saved round state.',function(){foodHidden.clear();restaurantHidden.clear();save('foodHidden',[]);save('restaurantHidden',[]);clearFoodRound();clearRestaurantRound();var custom=load('custom',[]);custom.forEach(function(x){});foods=foods.filter(function(x){return String(x.id||'').indexOf('custom-')!==0});startFood(true);show('homeView')})};
}
function openMenu(){openSheet('Options','<p class="modal-copy">Choose what you need.</p>','<button id="menuHome">Home</button><button id="menuFresh">Start fresh</button><button id="menuHistory">History</button><button id="menuSettings">Settings</button><button id="menuAbout">About</button><button id="menuClose">Close</button>');$('menuHome').onclick=function(){closeSheet();show('homeView')};$('menuFresh').onclick=function(){closeSheet();clearFoodRound();clearRestaurantRound();startFood(true)};$('menuClose').onclick=closeSheet;$('menuHistory').onclick=openHistory;$('menuSettings').onclick=openSettings;$('menuAbout').onclick=function(){openSheet('About Dinliminate','<p class="modal-copy">Made by Brian Dunn for Devona Dunn.</p>','<button id="aboutClose">Close</button>');$('aboutClose').onclick=closeSheet}}
function startPass(type){var pool=type==='food'?foodEligible():restEligible();if(pool.length<2){openSheet('Pass Around','<p class="modal-copy">Pass Around needs at least two choices.</p>','<button id="passOnlyClose">Close</button>');$('passOnlyClose').onclick=closeSheet;return}openSheet('Pass Around','<p class="modal-copy">Each person gets the same list. Left cuts a choice. Right keeps it. Choices everyone keeps become finalists.</p><label>People<select id="passPeople"><option value="2">2 people</option><option value="3">3 people</option><option value="4">4 people</option><option value="5">5 people</option></select></label>','<button id="passCancel">Cancel</button><button id="passStart" class="primary">Start</button>');$('passCancel').onclick=closeSheet;$('passStart').onclick=function(){var n=Number($('passPeople').value)||2;closeSheet();pass={type:type,people:n,person:1,pool:pool.map(function(x){return Object.assign({},x)}),index:0,votes:Array.from({length:n},function(){return{}})};if(type==='food'){foodDeck=pass.pool.slice();foodHeld=[];foodQuick.clear();show('foodView');renderPassFood()}else{restaurants=pass.pool.slice();restaurantHeld=[];restaurantQuick.clear();restaurantQuery='';show('restaurantView');renderPassRestaurant()}}}
function renderPassFood(){var current=foodEligible()[0];$('foodCount').textContent='Person '+pass.person+' of '+pass.people;if(!current){nextPassPerson();return}renderFood();$('foodCount').textContent='Person '+pass.person+' of '+pass.people+' · '+foodEligible().length+' left'}
function renderPassRestaurant(){var current=restEligible()[0];$('restaurantCount').textContent='Person '+pass.person+' of '+pass.people;if(!current){nextPassPerson();return}renderRestaurant();$('restaurantCount').textContent='Person '+pass.person+' of '+pass.people+' · '+restEligible().length+' left'}
function passAct(kind){var current=pass&&(pass.type==='food'?foodEligible()[0]:restEligible()[0]);if(!current)return;pass.votes[pass.person-1][String(current.id||current.name)]=kind;if(pass.type==='food'){foodDeck=foodDeck.filter(function(x){return x.id!==current.id});if(!foodDeck.length)nextPassPerson();else renderPassFood()}else{restaurants=restaurants.filter(function(x){return rKey(x)!==rKey(current)});if(!restaurants.length)nextPassPerson();else renderPassRestaurant()}}
function nextPassPerson(){if(pass.person<pass.people){pass.person++;if(pass.type==='food'){foodDeck=pass.pool.slice();foodHeld=[];foodQuick.clear();renderPassFood()}else{restaurants=pass.pool.slice();restaurantHeld=[];restaurantQuick.clear();renderPassRestaurant()}return}var finals=pass.pool.filter(function(x){var k=String(x.id||x.name);return pass.votes.every(function(v){return v[k]=== 'maybe'})});if(!finals.length){finals=pass.pool.slice(0,4)}var type=pass.type;pass=null;if(type==='food'){foodDeck=finals;foodHeld=[];foodQuick.clear();renderFood()}else{restaurants=finals;restaurantHeld=[];restaurantQuick.clear();renderRestaurant()}openSheet('Pass Around complete','<p class="modal-copy">'+finals.length+' choices made it through. Choose the final winner by swiping right on the last card.</p>','<button id="passDone">Continue</button>');$('passDone').onclick=closeSheet}
function passAwareCut(type){if(pass&&pass.type===type){passAct('cut');return true}return false}
function passAwareMaybe(type){if(pass&&pass.type===type){passAct('maybe');return true}return false}

$('foodMode').onclick=startFood;
$('restaurantMode').onclick=function(){startRestaurants(false)};
$('moreBtn').onclick=openMenu;
$('homeHelpLink').onclick=function(){$('phoneHelpBtn').click()};$('phoneHelpBtn').onclick=function(){openSheet('How to add to phone','<p class="modal-copy">On iPhone, open Dinliminate in Safari, tap Share, then Add to Home Screen.</p>','<button id="phoneClose">Close</button>');$('phoneClose').onclick=closeSheet};
$('addFoodBtn').onclick=openAddFood;$('randomFoodBtn').onclick=randomFood;$('foodPassBtn').onclick=function(){startPass('food')};
$('restaurantPassBtn').onclick=function(){startPass('restaurant')};
$('foodCut').onclick=function(){if(!passAwareCut('food'))cutFood()};$('foodMaybe').onclick=function(){if(!passAwareMaybe('food'))maybeFood()};$('foodBack').onclick=undoFood;$('foodHide').onclick=hideFood;
$('restaurantCut').onclick=function(){if(!passAwareCut('restaurant'))cutRestaurant()};$('restaurantMaybe').onclick=function(){if(!passAwareMaybe('restaurant'))maybeRestaurant()};$('restaurantBack').onclick=undoRestaurant;$('restaurantHide').onclick=hideRestaurant;
$('restaurantLocation').addEventListener('input',function(e){selectedMagicKey='';restaurantSuggestToken++;suggest(e.target.value)});$('restaurantLocation').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();findRestaurants()}if(e.key==='Escape')showSuggestions([])});$('findBtn').onclick=findRestaurants;$('locateBtn').onclick=useLocation;$('restaurantRadius').onchange=function(){if(restaurantArea)loadRestaurants(restaurantArea.lat,restaurantArea.lon,restaurantArea.display).catch(function(){})};$('openUnknownBtn').onclick=function(){restaurantOpen=!restaurantOpen;saveRestaurantRound();syncRestTools();renderRestaurant()};$('restaurantSearchBtn').onclick=function(){restaurantQuery=$('restSearch').classList.contains('open')?'':' ';syncRestTools();if(restaurantQuery===' '){restaurantQuery='';$('restQuery').value='';$('restSearch').classList.add('open');$('restQuery').focus()}else{$('restSearch').classList.remove('open');$('restQuery').value='';renderRestaurant()}};$('restQuery').addEventListener('input',function(e){restaurantQuery=e.target.value;saveRestaurantRound();renderRestaurant()});$('clearRestQuery').onclick=function(){restaurantQuery='';$('restQuery').value='';saveRestaurantRound();renderRestaurant()};$('modal').addEventListener('click',function(e){if(e.target.id==='modal')closeSheet()});

function boot(){
 var custom=load('custom',[]);custom.forEach(function(x){if(!foods.some(function(f){return f.id===x.id}))foods.push(x)});
 syncRestTools();show('homeView');
 window.DinliminateDiagnostics={version:VERSION,foodCount:function(){return foodEligible().length},restaurantCount:function(){return restEligible().length},passActive:function(){return !!pass},release:'phase3-recovery'};
}
boot();
})();
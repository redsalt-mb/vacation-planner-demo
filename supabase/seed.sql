-- ==========================================
-- Seed: Vipiteno / Sterzing destination
-- ==========================================

-- Use a fixed UUID for the Vipiteno destination so templates can reference activity UUIDs
-- We use deterministic UUIDs based on the original string IDs

INSERT INTO public.destinations (id, name, name_local, country, region, description, latitude, longitude, timezone, default_zoom, getting_there, useful_links, emergency_numbers, travel_tips)
VALUES (
    '00000000-0000-4000-a000-000000000001',
    'Vipiteno',
    'Sterzing',
    'Italy',
    'South Tyrol',
    'Vipiteno (German: Sterzing) is a charming medieval town at 948m in the Wipp Valley of South Tyrol, Italy. Known for its colorful painted facades, the iconic Zwölferturm tower, and a perfect blend of Italian and Austrian culture. With the Alps as a backdrop, it offers outstanding food, family-friendly outdoor activities, and a relaxed alpine atmosphere.',
    46.8968,
    11.4294,
    'Europe/Rome',
    14,
    '{"byTrain": "On the Brenner railway line. Direct trains from Innsbruck (45 min) and Bolzano (1 hour). Trenitalia and ÖBB services.", "byCar": "A13/E45 Brenner motorway. Exit Vipiteno/Sterzing. 1 hour from Innsbruck, 1.5 hours from Bolzano.", "byPlane": "Nearest airports: Innsbruck (80 km), Bolzano (70 km), Verona (250 km), Munich (280 km)."}'::jsonb,
    '[{"label": "Vipiteno Tourism", "url": "https://www.vipiteno.com"}, {"label": "Rosskopf / Monte Cavallo", "url": "https://www.rosskopf.com"}, {"label": "South Tyrol Info", "url": "https://www.suedtirol.info"}, {"label": "Trenitalia", "url": "https://www.trenitalia.com"}]'::jsonb,
    '[{"label": "General Emergency", "number": "112"}, {"label": "Medical Emergency", "number": "118"}, {"label": "Police (Carabinieri)", "number": "112"}, {"label": "Fire Department", "number": "115"}]'::jsonb,
    ARRAY[
        'South Tyrol is bilingual — Italian and German are both official languages',
        'The Gästekarte (guest card) gives free public transport and discounts on cable cars',
        'Tap water is excellent mountain spring water — no need to buy bottled',
        'Many restaurants close between 2:30-6pm (riposo/Mittagspause)',
        'Sunscreen is essential even on cloudy days at altitude'
    ]
);

-- ==========================================
-- Seed: Activities (with deterministic UUIDs)
-- ==========================================

-- Map original string IDs → UUID namespace:
-- food-lilie           → 00000000-0000-4000-a000-000000000101
-- food-zur-traube      → 00000000-0000-4000-a000-000000000102
-- food-prantneralm     → 00000000-0000-4000-a000-000000000103
-- food-zoll-steakhouse → 00000000-0000-4000-a000-000000000104
-- food-vis-a-vis       → 00000000-0000-4000-a000-000000000105
-- food-il-ghiottone    → 00000000-0000-4000-a000-000000000106
-- food-cafe-rose       → 00000000-0000-4000-a000-000000000107
-- food-latteria        → 00000000-0000-4000-a000-000000000108
-- food-vinzenz         → 00000000-0000-4000-a000-000000000109
-- outdoors-rosskopf    → 00000000-0000-4000-a000-000000000201
-- outdoors-rossy-walk  → 00000000-0000-4000-a000-000000000202
-- outdoors-old-town    → 00000000-0000-4000-a000-000000000203
-- outdoors-isarco      → 00000000-0000-4000-a000-000000000204
-- outdoors-trenser     → 00000000-0000-4000-a000-000000000205
-- outdoors-val-ridanna → 00000000-0000-4000-a000-000000000206
-- outdoors-forte       → 00000000-0000-4000-a000-000000000207
-- kids-balneum         → 00000000-0000-4000-a000-000000000301
-- kids-rossy-park      → 00000000-0000-4000-a000-000000000302
-- kids-playground-marg → 00000000-0000-4000-a000-000000000303
-- kids-playground-sport→ 00000000-0000-4000-a000-000000000304
-- kids-playground-mauls→ 00000000-0000-4000-a000-000000000305
-- kids-farm-visit      → 00000000-0000-4000-a000-000000000306
-- culture-zwoelferturm → 00000000-0000-4000-a000-000000000401
-- culture-mining       → 00000000-0000-4000-a000-000000000402
-- culture-christmas    → 00000000-0000-4000-a000-000000000403
-- culture-bolzano      → 00000000-0000-4000-a000-000000000404

-- ===== FOOD =====

INSERT INTO public.activities (id, destination_id, name, name_local, description, category, subcategory, area, address, latitude, longitude, google_maps_url, kid_friendliness, tips, estimated_duration, price_range, image_emoji, source, sort_order) VALUES
('00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'Restaurant Lilie', 'Restaurant Lilie', 'Elegant restaurant in Hotel Lilie serving refined South Tyrolean dishes. Known for excellent local wines and seasonal menus featuring speck, canederli, and fresh game.', 'food', 'restaurant', 'Vipiteno old town', 'Città Nuova 47, Vipiteno', 46.8972, 11.4305, 'https://maps.google.com/?q=Hotel+Lilie+Vipiteno', 3, ARRAY['More of a date-night spot — go when grandparents babysit', 'The wine list features excellent local Südtiroler wines', 'Reservations recommended in high season'], '1.5-2 hours', 'expensive', '🍷', 'seed', 1),

('00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000001', 'Ristorante Pizzeria Zur Traube', 'Zur Traube', 'Family-friendly restaurant with Tyrolean ambiance. Serves both traditional South Tyrolean dishes and Italian pizza — perfect when kids want pizza and parents want canederli.', 'food', 'restaurant', 'Vipiteno old town', NULL, 46.8965, 11.4298, 'https://maps.google.com/?q=Zur+Traube+Vipiteno', 5, ARRAY['Great option when kids want pizza and adults want local cuisine', 'Wood-paneled interior is cozy on rainy days', 'Ask for high chairs — they have several'], '1-1.5 hours', 'moderate', '🍕', 'seed', 2),

('00000000-0000-4000-a000-000000000103', '00000000-0000-4000-a000-000000000001', 'Prantneralm', NULL, 'Mountain hut (malga) serving hearty Tyrolean food. Try the Hirsch Goulash and Knödel with a stunning valley view. A hike-and-eat experience.', 'food', 'malga', 'Above Vipiteno', NULL, 46.9125, 11.4600, 'https://maps.google.com/?q=Prantneralm+Sterzing', 4, ARRAY['Reachable by a moderate hike — stroller-friendly on the main path', 'The Kaiserschmarrn is huge and perfect for sharing with kids', 'Outdoor seating with playground nearby'], '2-3 hours (including walk)', 'moderate', '🏔️', 'seed', 3),

('00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'Zoll Steakhouse, Burger & More', NULL, 'Casual and family-friendly spot with burgers, steaks, and local products. Relaxed atmosphere where kids can be kids.', 'food', 'restaurant', 'Vipiteno', NULL, 46.8950, 11.4280, 'https://maps.google.com/?q=Zoll+Steakhouse+Vipiteno', 5, ARRAY['Good fallback when kids refuse local cuisine', 'Burgers use local beef — quality is excellent', 'Friendly staff used to families with small children'], '1 hour', 'moderate', '🍔', 'seed', 4),

('00000000-0000-4000-a000-000000000105', '00000000-0000-4000-a000-000000000001', 'Vis-à-Vis by Pardeller', 'Vis-à-Vis Pardeller', 'Bakery and café famous for exceptional apple strudel. Fresh pastries, bread, and coffee in a charming setting. A must-stop for breakfast or afternoon treat.', 'food', 'bakery', 'Vipiteno old town', NULL, 46.8970, 11.4302, 'https://maps.google.com/?q=Vis+a+Vis+Pardeller+Vipiteno', 4, ARRAY['The apple strudel is legendary — get there early before it sells out', 'Great for a quick breakfast before heading out', 'Kids love the fresh pastries and warm milk'], '30-45 min', 'budget', '🥐', 'seed', 5),

('00000000-0000-4000-a000-000000000106', '00000000-0000-4000-a000-000000000001', 'Il Ghiottone Gelateria', NULL, 'Homemade gelato with fresh fruit flavors and classic Italian varieties. Also serves street food and light snacks. A toddler magnet.', 'food', 'gelato', 'Vipiteno center', NULL, 46.8960, 11.4295, 'https://maps.google.com/?q=Il+Ghiottone+Vipiteno', 5, ARRAY['Fruit flavors are made with real fresh fruit', 'Get a cone and stroll the old town', 'Toddler portions available — just ask'], '20 min', 'budget', '🍦', 'seed', 6),

('00000000-0000-4000-a000-000000000107', '00000000-0000-4000-a000-000000000001', 'Café Rose', NULL, 'Cozy bistro with homemade ice cream, pastries, and a large sun terrace. Perfect for an afternoon break with the family.', 'food', 'café', 'Vipiteno center', NULL, 46.8958, 11.4290, 'https://maps.google.com/?q=Cafe+Rose+Vipiteno', 5, ARRAY['The sun terrace is spacious — easy to manage a stroller', 'Good coffee for parents, great ice cream for kids', 'Try the homemade cakes'], '30-45 min', 'budget', '☕', 'seed', 7),

('00000000-0000-4000-a000-000000000108', '00000000-0000-4000-a000-000000000001', 'Latteria Vipiteno', 'Sterzinger Milchhof', 'The famous Sterzing yogurt dairy. Visit the factory shop for fresh yogurt, cheese, butter, and local dairy products at great prices.', 'food', 'shop', 'Vipiteno', NULL, 46.8920, 11.4340, 'https://maps.google.com/?q=Latteria+Vipiteno', 5, ARRAY['The Sterzinger Joghurt is famous across Italy — stock up!', 'Kids love the fruit yogurt varieties', 'Great prices compared to supermarkets', 'Check opening hours — may close for lunch'], '20-30 min', 'budget', '🥛', 'seed', 8),

('00000000-0000-4000-a000-000000000109', '00000000-0000-4000-a000-000000000001', 'Vinzenz Zum Feinen Wein', NULL, 'Hearty Tyrolean meals in a warm, traditional atmosphere. Great selection of local wines and Südtiroler specialties.', 'food', 'restaurant', 'Vipiteno old town', NULL, 46.8968, 11.4300, 'https://maps.google.com/?q=Vinzenz+Zum+Feinen+Wein+Vipiteno', 3, ARRAY['Better for older kids or a parents-only evening', 'Wine selection is outstanding', 'Try the speck platter as a starter'], '1.5 hours', 'moderate', '🍽️', 'seed', 9);

-- ===== OUTDOORS =====

INSERT INTO public.activities (id, destination_id, name, name_local, description, category, subcategory, area, latitude, longitude, google_maps_url, kid_friendliness, tips, best_season, estimated_duration, price_range, website, image_emoji, source, sort_order) VALUES
('00000000-0000-4000-a000-000000000201', '00000000-0000-4000-a000-000000000001', 'Monte Cavallo / Rosskopf Cable Car', 'Rosskopf Seilbahn', '12-minute cable car ride from Vipiteno center to 2000m alpine meadows. Panoramic views, easy walking paths, playground, and mountain huts at the top.', 'outdoors', 'cable car', 'Monte Cavallo', 46.9050, 11.4430, 'https://maps.google.com/?q=Rosskopf+Seilbahn+Sterzing', 4, ARRAY['The cable car ride itself is an adventure for kids', 'Strollers work on the main paths at the top', 'Bring layers — significantly cooler at 2000m', 'Combine with Rossy Park petting zoo'], ARRAY['summer', 'winter'], '3-4 hours', 'moderate', 'https://www.rosskopf.com', '🚡', 'seed', 10),

('00000000-0000-4000-a000-000000000202', '00000000-0000-4000-a000-000000000001', 'Rossy Walk (Themed Family Trail)', 'Rossy Wanderweg', 'Themed family hiking trail on Monte Cavallo with game stops, memory games, musical instruments, and a marble track. Designed specifically for children.', 'outdoors', 'hiking', 'Monte Cavallo (top of cable car)', 46.9180, 11.4500, 'https://maps.google.com/?q=Rosskopf+Sterzing', 5, ARRAY['Take the cable car up first, then walk the trail', 'Allow extra time — kids will want to stop at every station', 'Ends at a mountain hut for lunch', 'Suitable for ages 3+, younger kids in carriers'], ARRAY['summer'], '2-3 hours', 'budget', NULL, '🎵', 'seed', 11),

('00000000-0000-4000-a000-000000000203', '00000000-0000-4000-a000-000000000001', 'Vipiteno Old Town Walk', NULL, 'Stroll through the colorful medieval old town. The main street (Città Nuova) is pedestrian-friendly with beautiful painted facades, shops, and cafés.', 'outdoors', 'walking', 'Vipiteno old town', 46.8968, 11.4294, 'https://maps.google.com/?q=Città+Nuova+Vipiteno', 4, ARRAY['Flat and stroller-friendly throughout', 'Combine with gelato and window shopping', 'The colorful facades are beautiful for photos', 'Look for the Zwölferturm tower at the center'], NULL, '1-2 hours', 'budget', NULL, '🏘️', 'seed', 12),

('00000000-0000-4000-a000-000000000204', '00000000-0000-4000-a000-000000000001', 'Isarco River Walk', 'Eisack Spazierweg', 'Easy, flat walking path along the Isarco river. Shaded sections, benches, and gentle enough for strollers and toddlers on foot.', 'outdoors', 'walking', 'Along Isarco River, Vipiteno', 46.8945, 11.4275, 'https://maps.google.com/?q=Isarco+River+Vipiteno', 5, ARRAY['Completely flat — perfect for strollers', 'Shaded stretches are nice on hot days', 'Toddlers love throwing stones in the river', 'Great for early morning or evening walks'], ARRAY['spring', 'summer', 'autumn'], '30-60 min', 'budget', NULL, '🌊', 'seed', 13),

('00000000-0000-4000-a000-000000000205', '00000000-0000-4000-a000-000000000001', 'Trenser Höhenweg', NULL, 'Circular hike (3.5 hours) between Freienfeld and Sterzing through the southern Wipptal valley. Exciting varied terrain — forests, meadows, views.', 'outdoors', 'hiking', 'Freienfeld to Sterzing', 46.8750, 11.4450, 'https://maps.google.com/?q=Trenser+Höhenweg+Sterzing', 2, ARRAY['Better for older kids (6+) or with a baby carrier', 'Not stroller-friendly — proper hiking trail', 'Beautiful views but requires stamina', 'Bring plenty of snacks and water'], ARRAY['summer', 'autumn'], '3.5 hours', 'budget', NULL, '🥾', 'seed', 14),

('00000000-0000-4000-a000-000000000206', '00000000-0000-4000-a000-000000000001', 'Val Ridanna / Ridnauntal', 'Ridnauntal', 'Beautiful valley 20 minutes from Vipiteno. Easy walks along streams, stunning scenery, and access to the Mining Museum. Great day trip.', 'outdoors', 'valley', 'Val Ridanna (20 min drive)', 46.9100, 11.3600, 'https://maps.google.com/?q=Ridnauntal+Südtirol', 4, ARRAY['Easy valley walks suitable for strollers', 'Combine with Mining Museum visit', 'Pack a picnic — beautiful spots along the stream', 'The valley narrows beautifully towards the end'], ARRAY['summer', 'autumn'], 'Half day', 'budget', NULL, '🏞️', 'seed', 15),

('00000000-0000-4000-a000-000000000207', '00000000-0000-4000-a000-000000000001', 'Forte di Fortezza', 'Franzensfeste', 'Massive 19th-century Austrian fortress, now a cultural center with exhibitions. Impressive architecture and grounds to explore.', 'outdoors', 'monument', 'Fortezza (15 min drive)', 46.7980, 11.6280, 'https://maps.google.com/?q=Forte+di+Fortezza', 3, ARRAY['Free to walk the grounds; exhibitions may have entry fee', 'Older kids find the fortress architecture exciting', 'Toddlers will enjoy running on the wide open spaces', 'Reachable by train from Vipiteno'], ARRAY['spring', 'summer', 'autumn'], '1-2 hours', 'budget', NULL, '🏰', 'seed', 16);

-- ===== KIDS =====

INSERT INTO public.activities (id, destination_id, name, name_local, description, category, subcategory, area, address, latitude, longitude, google_maps_url, kid_friendliness, tips, best_season, estimated_duration, price_range, website, image_emoji, source, sort_order) VALUES
('00000000-0000-4000-a000-000000000301', '00000000-0000-4000-a000-000000000001', 'Balneum Swimming Pool', 'Balneum Schwimmbad', 'Indoor and outdoor swimming complex with dedicated baby/toddler basin, children''s pool, current stream, and large grassy areas. Open year-round (outdoor pools June-September).', 'kids', 'swimming', 'Vipiteno', NULL, 46.8935, 11.4315, 'https://maps.google.com/?q=Balneum+Sterzing', 5, ARRAY['Toddler pool is very shallow and safe', 'Indoor pool available year-round', 'Gets busy on hot afternoons — go in the morning', 'Bring sun protection for the outdoor area', 'Has a small sauna area for parents'], ARRAY['summer'], '2-3 hours', 'budget', 'https://balneum.bz.it', '🏊', 'seed', 17),

('00000000-0000-4000-a000-000000000302', '00000000-0000-4000-a000-000000000001', 'Rossy Park Petting Zoo', 'Rossy Park Streichelzoo', 'Petting zoo at the top of the Monte Cavallo cable car with donkeys, ponies, dwarf sheep, dwarf goats, llamas, and alpacas. Pure toddler paradise.', 'kids', 'animals', 'Monte Cavallo (top of cable car)', NULL, 46.9185, 11.4505, 'https://maps.google.com/?q=Rossy+Park+Rosskopf', 5, ARRAY['Combine with Rossy Walk and cable car ride', 'Free entry — included with cable car ticket', 'Alpacas and llamas are the star attraction', 'Kids can feed and pet the animals'], ARRAY['summer'], '30-60 min', 'budget', NULL, '🦙', 'seed', 18),

('00000000-0000-4000-a000-000000000303', '00000000-0000-4000-a000-000000000001', 'Playground Via S. Margherita', NULL, 'Well-maintained playground in Vipiteno with swings, slides, climbing structures, and sandbox. Suitable for toddlers and small children.', 'kids', 'playground', 'Vipiteno center', 'Via S. Margherita, Vipiteno', 46.8955, 11.4285, 'https://maps.google.com/?q=playground+Via+Santa+Margherita+Vipiteno', 5, ARRAY['Shaded areas available', 'Close to the town center — combine with a walk', 'Has equipment for different age groups'], NULL, '30-60 min', 'budget', NULL, '🛝', 'seed', 19),

('00000000-0000-4000-a000-000000000304', '00000000-0000-4000-a000-000000000001', 'Playground Zona Sportiva', NULL, 'Playground near the sports zone with larger play structures. More space for running and a grassy area for picnics.', 'kids', 'playground', 'Vipiteno sports zone', NULL, 46.8930, 11.4310, 'https://maps.google.com/?q=Zona+Sportiva+Vipiteno', 5, ARRAY['More open space than the central playground', 'Great for a picnic break', 'Near Balneum pool — combine visits'], NULL, '30-60 min', 'budget', NULL, '🎪', 'seed', 20),

('00000000-0000-4000-a000-000000000305', '00000000-0000-4000-a000-000000000001', 'Playground Mauls/Mules', NULL, 'Quieter playground in the nearby hamlet of Mauls. Less crowded, surrounded by meadows and mountain views.', 'kids', 'playground', 'Mauls (5 min drive)', NULL, 46.8780, 11.4400, 'https://maps.google.com/?q=playground+Mauls+Mules+Sterzing', 5, ARRAY['Quieter alternative to town playgrounds', 'Beautiful mountain backdrop', 'Good stop on the way to/from valley excursions'], NULL, '30-60 min', 'budget', NULL, '🌄', 'seed', 21),

('00000000-0000-4000-a000-000000000306', '00000000-0000-4000-a000-000000000001', 'Farm Visit (Bauernhof)', NULL, 'Visit a working South Tyrolean farm. Collect eggs, see cows, pet animals, and experience rural alpine life. Several farms in the area welcome visitors.', 'kids', 'farm', 'Surrounding area', NULL, 46.9000, 11.4200, 'https://maps.google.com/?q=Bauernhof+Sterzing', 5, ARRAY['Ask at the tourist office for farms currently accepting visitors', 'Morning visits are best — animals are more active', 'Bring boots for muddy paths', 'Some farms sell fresh eggs, milk, and cheese'], ARRAY['spring', 'summer', 'autumn'], '1-2 hours', 'budget', NULL, '🐄', 'seed', 22);

-- ===== CULTURE =====

INSERT INTO public.activities (id, destination_id, name, name_local, description, category, subcategory, area, latitude, longitude, google_maps_url, kid_friendliness, tips, best_season, estimated_duration, price_range, image_emoji, source, sort_order) VALUES
('00000000-0000-4000-a000-000000000401', '00000000-0000-4000-a000-000000000001', 'Zwölferturm (Tower of the Twelve)', NULL, 'Iconic 46m medieval tower from the 15th century, landmark of Vipiteno. Marks the division between old and new town. Visible from everywhere.', 'culture', 'landmark', 'Vipiteno center', 46.8968, 11.4294, 'https://maps.google.com/?q=Zwölferturm+Vipiteno', 3, ARRAY['Great photo spot', 'Kids like counting the windows', 'Combine with old town walk'], NULL, '15 min', 'budget', '🗼', 'seed', 23),

('00000000-0000-4000-a000-000000000402', '00000000-0000-4000-a000-000000000001', 'Mining Museum Ridanna', 'Landesmuseum Bergbau Ridnaun', 'One of Europe''s most important mining museums in nearby Val Ridanna. Walk through real mine tunnels and see historical mining equipment.', 'culture', 'museum', 'Val Ridanna (20 min drive)', 46.9140, 11.3550, 'https://maps.google.com/?q=Landesmuseum+Bergbau+Ridnaun', 3, ARRAY['Older kids (5+) find the mine tunnels exciting', 'Bring warm clothes — mines are cold inside', 'Guided tours available in Italian, German, and English', 'Combine with a Val Ridanna walk'], ARRAY['spring', 'summer', 'autumn'], '2 hours', 'moderate', '⛏️', 'seed', 24),

('00000000-0000-4000-a000-000000000403', '00000000-0000-4000-a000-000000000001', 'Vipiteno Christmas Market', 'Sterzinger Weihnachtsmarkt', 'Charming Christmas market in the medieval old town. Mulled wine (Glühwein), roasted chestnuts, handmade crafts, and magical atmosphere.', 'culture', 'market', 'Vipiteno old town', 46.8966, 11.4296, 'https://maps.google.com/?q=Christmas+Market+Vipiteno', 4, ARRAY['Open late November through early January', 'Kids love the lights and sweet treats', 'Go in the evening for the best atmosphere', 'Try Glühwein for parents, hot chocolate for kids'], ARRAY['winter'], '1-2 hours', 'budget', '🎄', 'seed', 25),

('00000000-0000-4000-a000-000000000404', '00000000-0000-4000-a000-000000000001', 'Day Trip to Bolzano', 'Tagesausflug nach Bozen', 'South Tyrol''s capital, 1 hour south. Home to Ötzi the Iceman museum, beautiful arcaded streets, and lively piazzas. Reachable by train.', 'culture', 'day trip', 'Bolzano (1 hour by train/car)', 46.4983, 11.3548, 'https://maps.google.com/?q=Bolzano+Italy', 3, ARRAY['Take the train — scenic ride and no parking hassle', 'Ötzi museum is fascinating for kids 5+', 'Piazza Walther has space for kids to run around', 'Plenty of gelato shops for bribery purposes'], NULL, 'Full day', 'moderate', '🚆', 'seed', 26);

-- ===== WEATHER =====

INSERT INTO public.destination_weather (destination_id, season, months, temp_range, emoji, description, tips) VALUES
('00000000-0000-4000-a000-000000000001', 'spring', 'March – May', '5–18°C', '🌸', 'Flowers bloom in the valleys, snow melts in the mountains. Variable weather — sunny mornings can turn to rain.', ARRAY['Pack layers — big temperature swings', 'April can still be rainy; May is usually lovely', 'Flower Festival is a highlight', 'Some cable cars may still be closed early spring']),
('00000000-0000-4000-a000-000000000001', 'summer', 'June – August', '15–28°C', '☀️', 'Warm days, cool evenings. Ideal for hiking, swimming, and outdoor dining. Afternoon thunderstorms common in the mountains.', ARRAY['Always pack a rain jacket for mountain excursions', 'Mornings are best for hiking — storms often come after 2pm', 'Evenings cool down fast — bring a fleece', 'Book accommodation early for July and August', 'The outdoor pool at Balneum opens in June']),
('00000000-0000-4000-a000-000000000001', 'autumn', 'September – November', '5–18°C', '🍂', 'Gorgeous fall colors, harvest season, fewer crowds. Crisp air and stunning golden larch forests on the mountains.', ARRAY['September is still warm enough for outdoor swimming', 'October brings spectacular fall colors', 'Local harvest festivals with food and wine', 'Cable cars typically close mid-October']),
('00000000-0000-4000-a000-000000000001', 'winter', 'December – February', '-5–5°C', '❄️', 'Snow-covered alpine wonderland. Christmas markets, skiing, and the famous 10km toboggan run on Rosskopf.', ARRAY['Christmas Market runs late November to early January', 'Dress in warm layers — it gets very cold', 'Rosskopf becomes a family ski area', 'Indoor activities like Balneum (indoor pool) and museums', 'Shorter days — plan outdoor activities for midday']);

-- ===== ITINERARY TEMPLATES =====

INSERT INTO public.itinerary_templates (destination_id, label, activity_ids, sort_order) VALUES
('00000000-0000-4000-a000-000000000001', 'Relaxed Town Day', ARRAY[
    '00000000-0000-4000-a000-000000000105'::uuid,
    '00000000-0000-4000-a000-000000000203'::uuid,
    '00000000-0000-4000-a000-000000000106'::uuid,
    '00000000-0000-4000-a000-000000000303'::uuid,
    '00000000-0000-4000-a000-000000000102'::uuid
], 1),
('00000000-0000-4000-a000-000000000001', 'Mountain Adventure', ARRAY[
    '00000000-0000-4000-a000-000000000201'::uuid,
    '00000000-0000-4000-a000-000000000202'::uuid,
    '00000000-0000-4000-a000-000000000302'::uuid,
    '00000000-0000-4000-a000-000000000103'::uuid
], 2),
('00000000-0000-4000-a000-000000000001', 'Valley Excursion', ARRAY[
    '00000000-0000-4000-a000-000000000206'::uuid,
    '00000000-0000-4000-a000-000000000402'::uuid,
    '00000000-0000-4000-a000-000000000107'::uuid,
    '00000000-0000-4000-a000-000000000301'::uuid
], 3);

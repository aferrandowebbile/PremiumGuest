insert into public.tenants (tenant_id, slug, name)
values
  ('1', 'aspen-snowmass', 'Aspen Snowmass'),
  ('2', 'whistler-blackcomb', 'Whistler Blackcomb'),
  ('3', 'vail', 'Vail'),
  ('4', 'moreys-piers', 'Morey''s Piers')
on conflict (tenant_id) do update
set slug = excluded.slug,
    name = excluded.name,
    is_active = true;

insert into public.tenant_configs (tenant_id, config)
values (
  '1',
  jsonb_build_object(
    'name', 'Aspen Snowmass',
    'theme', jsonb_build_object('primary', '#1D4ED8', 'secondary', '#0EA5E9'),
    'enabledModules', jsonb_build_object('ski', true, 'park', true, 'offers', true, 'events', true, 'commerce', false),
    'supportedLanguages', jsonb_build_array('en','es','fr','de','ar','ja','zh'),
    'homePage',
      jsonb_build_object(
        'schemaVersion', 1,
        'title', 'Guest Home',
        'sections', jsonb_build_array(
          jsonb_build_object('id','hero-main','type','hero','props',jsonb_build_object('title','Good morning, explore your day','subtitle','Lift access, wait times, shows and curated experiences.','ctaLabel','View today','ctaRoute','/event/today','gradient',jsonb_build_array('#1D4ED8','#0EA5E9'))),
          jsonb_build_object('id','quick-actions','type','quickActions','props',jsonb_build_object('title','Quick actions','actions',jsonb_build_array(
            jsonb_build_object('id','lift','label','Lift status','icon','mountain','route','/poi/lifts','module','ski'),
            jsonb_build_object('id','slopes','label','Slopes','icon','flag','route','/poi/slopes','module','ski'),
            jsonb_build_object('id','wait','label','Wait times','icon','timer','route','/poi/wait-times','module','park'),
            jsonb_build_object('id','shows','label','Shows','icon','ticket','route','/event/shows','module','park')
          ))),
          jsonb_build_object('id','module-highlights','type','infoBanner','props',jsonb_build_object('title','Today at the resort','message','Snow quality and ride queue snapshots update every 15 minutes.','variant','moduleHighlights')),
          jsonb_build_object('id','offers-carousel','type','cardCarousel','props',jsonb_build_object('title','Featured offers','items',jsonb_build_array(
            jsonb_build_object('id','offer-1','title','Sunrise Gondola','subtitle','20% off before 10:00','route','/offer/offer-1'),
            jsonb_build_object('id','offer-2','title','Family FastPass','subtitle','Skip select lines today','route','/offer/offer-2')
          ))),
          jsonb_build_object('id','today-list','type','list','props',jsonb_build_object('title','Today at the resort/park','items',jsonb_build_array(
            jsonb_build_object('id','event-1','title','Avalanche Safety Intro','subtitle','10:30 · Base Camp','route','/event/event-1'),
            jsonb_build_object('id','event-2','title','Parade on Main Street','subtitle','14:00 · Park Plaza','route','/event/event-2')
          ))),
          jsonb_build_object('id','web-conditions','type','webEmbed','props',jsonb_build_object('title','Live conditions','url','https://www.example.com/conditions','buttonLabel','Open live dashboard'))
        )
      )
  )
)
on conflict (tenant_id) do update set config = excluded.config, updated_at = now();

insert into public.notifications (tenant_id, title, body)
values
  ('1', 'Road access update', 'Expect 10 min delays near North Gate.'),
  ('1', 'Evening lights show', 'Starts at 19:00 in Park Plaza.');

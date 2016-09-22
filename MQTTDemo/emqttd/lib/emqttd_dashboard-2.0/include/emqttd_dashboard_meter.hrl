-define(METRICS_DEF, [{new_gauge, 'bytes/received'},
                  {new_gauge, 'bytes/sent'},
                  {new_gauge, 'messages/dropped'},
                  {new_gauge, 'messages/qos0/received'},
                  {new_gauge, 'messages/qos0/sent'},
                  {new_gauge, 'messages/qos1/received'},
                  {new_gauge, 'messages/qos1/sent'},
                  {new_gauge, 'messages/qos2/received'},
                  {new_gauge, 'messages/qos2/sent'},
                  {new_gauge, 'messages/received'},
                  {new_gauge, 'messages/retained'},
                  {new_gauge, 'messages/sent'},
                  {new_gauge, 'packets/connack'},
                  {new_gauge, 'packets/connect'},
                  {new_gauge, 'packets/disconnect'},
                  {new_gauge, 'packets/pingreq'},
                  {new_gauge, 'packets/pingresp'},
                  {new_gauge, 'packets/puback/received'},
                  {new_gauge, 'packets/puback/sent'},
                  {new_gauge, 'packets/pubcomp/received'},
                  {new_gauge, 'packets/pubcomp/sent'},
                  {new_gauge, 'packets/publish/received'},
                  {new_gauge, 'packets/publish/sent'},
                  {new_gauge, 'packets/pubrec/received'},
                  {new_gauge, 'packets/pubrec/sent'},
                  {new_gauge, 'packets/pubrel/received'},
                  {new_gauge, 'packets/pubrel/sent'},
                  {new_gauge, 'packets/received'},
                  {new_gauge, 'packets/sent'},
                  {new_gauge, 'packets/suback'},
                  {new_gauge, 'packets/subscribe'},
                  {new_gauge, 'packets/unsuback'},
                  {new_gauge, 'packets/unsubscribe'}]).

-define(METRICS, [Name || {_, Name} <- ?METRICS_DEF]).

-define(REPORT_INTERVAL, 5 * 1000).
-define(INTERVAL_1, 60 * 1000 * 1).  %% 1 minutes interval, data merging
-define(INTERVAL_2, 60 * 1000 * 15). %% 15 minutes interval, data merging
-define(INTERVAL_3, 60 * 1000 * 60). %% 60 minutes interval, data merging


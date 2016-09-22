%%--------------------------------------------------------------------
%% Copyright (c) 2012-2016 Feng Lee <feng@emqtt.io>.
%%
%% Licensed under the Apache License, Version 2.0 (the "License");
%% you may not use this file except in compliance with the License.
%% You may obtain a copy of the License at
%%
%%     http://www.apache.org/licenses/LICENSE-2.0
%%
%% Unless required by applicable law or agreed to in writing, software
%% distributed under the License is distributed on an "AS IS" BASIS,
%% WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
%% See the License for the specific language governing permissions and
%% limitations under the License.
%%--------------------------------------------------------------------

%%--------------------------------------------------------------------
%% MQTT-SN MsgTypes
%%--------------------------------------------------------------------

-define(SN_ADVERTISE,     16#00).
-define(SN_SEARCHGW,      16#01).
-define(SN_GWINFO,        16#02).
-define(SN_CONNECT,       16#04).
-define(SN_CONNACK,       16#05).
-define(SN_WILLTOPICREQ,  16#06).
-define(SN_WILLTOPIC,     16#07).
-define(SN_WILLMSGREQ,    16#08).
-define(SN_WILLMSG,       16#09).
-define(SN_REGISTER,      16#0A).
-define(SN_REGACK,        16#0B).
-define(SN_PUBLISH,       16#0C).
-define(SN_PUBACK,        16#0D).
-define(SN_PUBCOMP,       16#0E).
-define(SN_PUBREC,        16#0F).
-define(SN_PUBREL,        16#10).
-define(SN_SUBSCRIBE,     16#12).
-define(SN_SUBACK,        16#13).
-define(SN_UNSUBSCRIBE,   16#14).
-define(SN_UNSUBACK,      16#15).
-define(SN_PINGREQ,       16#16).
-define(SN_PINGRESP,      16#17).
-define(SN_DISCONNECT,    16#18).
-define(SN_WILLTOPICUPD,  16#1A).
-define(SN_WILLTOPICRESP, 16#1B).
-define(SN_WILLMSGUPD,    16#1C).
-define(SN_WILLMSGRESP,   16#1D).

-type(mqtt_sn_type() :: ?SN_ADVERTISE..?SN_WILLMSGRESP).

-define(SN_RC_ACCECPTED,        16#00).
-define(SN_RC_CONGESTION,       16#01).
-define(SN_RC_INVALID_TOPIC_ID, 16#02).
-define(SN_RC_NOT_SUPPORTED,    16#03).

-type(mqtt_sn_return_code() :: ?SN_RC_ACCECPTED .. ?SN_RC_NOT_SUPPORTED).

%%--------------------------------------------------------------------
%% MQTT-SN Message
%%--------------------------------------------------------------------

-record(mqtt_sn_flags, {dup, qos, retain, will, clean_session, topic_id_type}).

-type(mqtt_sn_flags() :: #mqtt_sn_flags{}).

-type(mqtt_sn_variable() :: undefined | integer() | binary() | tuple()).

-record(mqtt_sn_message, {type     :: mqtt_sn_type(),
                          variable :: mqtt_sn_variable()}).

-type(mqtt_sn_message() :: #mqtt_sn_message{}).

-define(SN_ADVERTISE_MSG(GwId, Duration),
        #mqtt_sn_message{type     = ?SN_ADVERTISE,
                         variable = {GwId, Duration}}).

-define(SN_SEARCHGW_MSG(Radius),
        #mqtt_sn_message{type     = ?SN_SEARCHGW,
                         variable = Radius}).

-define(SN_GWINFO_MSG(GwId, GwInfo),
        #mqtt_sn_message{type     = ?SN_GWINFO,
                         variable = {GwId, GwInfo}}).

-define(SN_CONNECT_MSG(Flags, ProtocolId, Duration, ClientId),
        #mqtt_sn_message{type     = ?SN_CONNECT,
                         variable = {Flags, ProtocolId, Duration, ClientId}}).

-define(SN_CONNACK_MSG(ReturnCode),
        #mqtt_sn_message{type = ?SN_CONNACK, variable = ReturnCode}).

-define(SN_WILLTOPICREQ_MSG(),
        #mqtt_sn_message{type = ?SN_WILLTOPICREQ}).

-define(SN_WILLTOPIC_MSG(Flags, Topic),
        #mqtt_sn_message{type     = ?SN_WILLTOPIC,
                         variable = {Flags, Topic}}).

-define(SN_WILLMSGREQ_MSG(),
        #mqtt_sn_message{type = ?SN_WILLMSGREQ}).

-define(SN_WILLMSG_MSG(Msg), 
        #mqtt_sn_message{type = ?SN_WILLMSG, variable = Msg}).

-define(SN_REGISTER_MSG(TopicId, MsgId, TopicName),
        #mqtt_sn_message{type     = ?SN_REGISTER,
                         variable = {TopicId, MsgId, TopicName}}).

-define(SN_REGACK_MSG(TopicId, MsgId, ReturnCode),
        #mqtt_sn_message{type     = ?SN_REGACK,
                         variable = {TopicId, MsgId, ReturnCode}}).

-define(SN_PUBLISH_MSG(Flags, TopicId, MsgId, Data),
       #mqtt_sn_message{type     = ?SN_PUBLISH,
                        variable = {Flags, TopicId, MsgId, Data}}).

-define(SN_PUBACK_MSG(TopicId, MsgId, ReturnCode),
        #mqtt_sn_message{type    = ?SN_PUBACK,
                        variable = {TopicId, MsgId, ReturnCode}}).

-define(SN_PUBREC_MSG(Type, MsgId),
        #mqtt_sn_message{type     = Type, 
                         variable = MsgId}).

-define(SN_SUBSCRIBE_MSG(Flags, Msgid, Topic),
        #mqtt_sn_message{type     = ?SN_SUBSCRIBE,
                         variable = {Flags, Msgid, Topic}}).

-define(SN_SUBACK_MSG(Flags, TopicId, MsgId, ReturnCode),
        #mqtt_sn_message{type     = ?SN_SUBACK,
                         variable = {Flags, TopicId, MsgId, ReturnCode}}).

-define(SN_UNSUBSCRIBE_MSG(Flags, Msgid, Topic),
       #mqtt_sn_message{type     = ?SN_UNSUBSCRIBE,
                        variable = {Flags, Msgid, Topic}}).

-define(SN_UNSUBACK_MSG(Msgid),
       #mqtt_sn_message{type     = ?SN_UNSUBACK,
                        variable = Msgid}).

-define(SN_PINGREQ_MSG(ClientId),
       #mqtt_sn_message{type = ?SN_PINGREQ, variable = ClientId}).

-define(SN_PINGRESP_MSG(), #mqtt_sn_message{type = ?SN_PINGRESP}).

-define(SN_DISCONNECT_MSG(Duration),
        #mqtt_sn_message{type     = ?SN_DISCONNECT,
                         variable = Duration}).

-define(SN_WILLTOPICUPD_MSG(Flags, Topic),
        #mqtt_sn_message{type     = ?SN_WILLTOPICUPD,
                         variable = {Flags, Topic}}).

-define(SN_WILLTOPICRESP_MSG(ReturnCode),
        #mqtt_sn_message{type     = ?SN_WILLTOPICRESP,
                         variable = ReturnCode}).

-define(SN_WILLMSGUPD_MSG(Msg),
        #mqtt_sn_message{type     = ?SN_WILLMSGUPD,
                         variable = Msg}).

-define(SN_WILLMSGRESP_MSG(ReturnCode),
        #mqtt_sn_message{type     = ?SN_WILLMSGRESP,
                         variable = ReturnCode}).
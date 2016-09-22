%%%-----------------------------------------------------------------------------
%%% Copyright (c) 2014-2016 Feng Lee <feng@emqtt.io>. All Rights Reserved.
%%%
%%% Permission is hereby granted, free of charge, to any person obtaining a copy
%%% of this software and associated documentation files (the "Software"), to deal
%%% in the Software without restriction, including without limitation the rights
%%% to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
%%% copies of the Software, and to permit persons to whom the Software is
%%% furnished to do so, subject to the following conditions:
%%%
%%% The above copyright notice and this permission notice shall be included in all
%%% copies or substantial portions of the Software.
%%%
%%% THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
%%% IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
%%% FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
%%% AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
%%% LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
%%% OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
%%% SOFTWARE.
%%%-----------------------------------------------------------------------------

-define(LOG_ALL,        0).
-define(LOG_DEBUG,      1).
-define(LOG_INFO,       2).
-define(LOG_WARNING,    4).
-define(LOG_ERROR,      8).
-define(LOG_CRITICAL,   16).
-define(LOG_NONE,       1024).

-define(LOG_LEVEL_NUM(Level),
    case Level of
        all -> ?LOG_ALL;
        debug -> ?LOG_DEBUG;
        info -> ?LOG_INFO;
        warning -> ?LOG_WARNING;
        error -> ?LOG_ERROR;
        critical -> ?LOG_CRITICAL;
        none -> ?LOG_NONE
    end).


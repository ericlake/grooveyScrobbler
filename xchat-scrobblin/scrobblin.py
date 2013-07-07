import xchat
import json

__module_name__ = "scrobblin"
__module_version__ = "1.0"
__module_description__ = "Scrobble A Local Json File to a Channel"


class Scrobble(object):

    def __init__(self):
        self.file = '/Users/will5324/Library/Containers/org.3rddev.xchatazure/Data/scrobblin.json'
        self.squelch = ''
        self.scrobblers = {}

    def command(self, word, word_eol, userdata):
        command = word[0]
        if len(word) > 1:
            params = word[1]
        else:
            params = ''
            print "usage: " + command + " now | start | stop"

        context = xchat.get_context()

        if params == 'start':
            self.start((context,))
        elif params == 'now':
            self.scrobble((context, 'force'))
        elif params == 'stop':
            self.stop((context,))
        return xchat.EAT_ALL

    def scrobble(self, userdata):
        """Return True to contintue scrobbling False on error"""
        try:
            nick = userdata[0].get_info('nick')
            context = userdata[0]
            fh = open(self.file, 'r')
            self.data = json.load(fh)
            if 'grooveyJson' in self.data:
                string = nick + ' is listening to ' + self.data['grooveyJson']['title'] +\
                                ' by ' + self.data['grooveyJson']['artist']
                if self.squelch != self.data['grooveyJson']['artist'] or \
                        'force' in userdata:
                    context.emit_print("Your Action", string)
                    self.squelch = self.data['grooveyJson']['artist']

        except:
            print 'missing data or invalid json ' + self.file
            raise
            return False
        finally:
            fh.close()

        return True

    def start(self, userdata):
        chan = userdata[0].get_info('channel')
        if not chan in self.scrobblers:
            self.scrobblers[chan] = xchat.hook_timer(30 * 1000, self.scrobble, userdata)
            print "scrobbling started on " + chan
        else:
            print "already scrobbling on " + chan

    def stop(self, userdata):
        chan = userdata[0].get_info('channel')
        if chan in self.scrobblers:
            xchat.unhook(self.scrobblers[chan])
            del self.scrobblers[chan]
            print "scrobbling ended on " + chan
        else:
            print "wheren't scrobbling on " + chan

# Start this shin-dig
scrobble = Scrobble()

xchat.hook_command('scrobble', scrobble.command, userdata=None,
                   priority=xchat.PRI_HIGHEST)

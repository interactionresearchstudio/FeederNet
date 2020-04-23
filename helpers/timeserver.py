#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import os
import json

is_time_set = False

class S(BaseHTTPRequestHandler):
    def _set_response(self, code):
        self.send_response(code)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_POST(self):
        data_string = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(data_string.decode('utf-8'))

        logging.info("Time: " + data["time"])

        global is_time_set
        if is_time_set:
            logging.info('Time has already been set.')
            self._set_response(301)
            self.wfile.write('NOT MODIFIED'.encode('utf-8'))
        else:
            self._set_response(200)
            self.wfile.write('SUCCESS'.encode('utf-8'))
            is_time_set = True
            logging.info('Updating time...')
            os.system('date -s "' + data["time"] + '" && hwclock -w')

def run(server_class=HTTPServer, handler_class=S, port=4000):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv
    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()

import asyncio
import socket

import curses
from curses.textpad import rectangle
from curses import _CursesWindow as Window

class TCPMonitor:
    def __init__(self, window: Window):
        self.window = window
        self.sock: socket.socket = None
        self.status: str = ""
        self.ip: str = ""
        self.port: int = 0

        asyncio.create_task(self.slow_loop())

    def set_destination(self, ip: str, port: int):
        self.ip = ip
        self.port = port

    async def slow_loop(self):
        while True:
            await asyncio.sleep(0.5)
            if self.sock is None:
                self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                try:
                    self.sock.connect((self.ip, self.port))
                    self.status = "Socket connected"
                except ConnectionRefusedError:
                    self.sock = None
                    self.status = "Connection refused"
                    continue

    def update(self):
        rectangle(self.window, 0, 0, 50, 20)
        self.window.addstr(1, 1, f"TCP Monitor [{self.ip}:{self.port}]"))
        self.window.addstr(2, 1, f"> {self.status}")

        self.window.refresh()



def main(screen: Window):
    # Clear screen
    curses.raw()
    screen.clear()

    # This raises ZeroDivisionError when i == 10.
    for i in range(0, 11):
        v = i-10
        screen.addstr(i, 0, '10 divided by {} is {}'.format(v, 10/v))

    screen.refresh()
    screen.getkey()

curses.wrapper(main)
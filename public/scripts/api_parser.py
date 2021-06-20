# -*- coding: utf-8 -*-

__author__ = 'Adriskk'
__date__ = '20.06.2021'
__description__ = 'FlightRadar24 API reader and parser'

# Imports
from FlightRadar24.api import FlightRadar24API
import json


fr_api = FlightRadar24API()
flights = fr_api.get_flights()
for flight in flights:
    print(flight.ground_speed)
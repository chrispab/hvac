class Heater(object):

    def __init__(self):
        logger.info("creating heater")
        self.state = OFF
        self.heatOffMs = cfg.getItemValueFromConfig('heatOffMs')  # min time heater is on or off for
        self.heatOnMs = cfg.getItemValueFromConfig('heatOnMs')  # min time heater is on or off for
        self.lastStateChangeMillis = -180000  # last time heater switched on or off - enables immediate action if process restarted

        self.heater_sp_offset = cfg.getItemValueFromConfig('heater_sp_offset')

        self.InternalTDiffMs = cfg.getItemValueFromConfig('heatInternalTDiffMs')
        self.ExternalTDiffMs = cfg.getItemValueFromConfig('heatExternalTDiffMs')

        self.status = 0

    def control(self, currentTemp, target_temp, d_state, current_millis):
        logger.info('==Heat ctl==')
        #calc new heater on t based on t gap
        self.heatOnMs = ((target_temp - currentTemp) * 20 * 1000)  + cfg.getItemValueFromConfig('heatOnMs')
        logger.info('==Heat tdelta on: %s',self.heatOnMs)

        #check for heater OFF hours #todo improve this
        #current_hour = datetime.datetime.now().hour
        #if current_hour in cfg.getItemValueFromConfig('heat_off_hours'):  # l on and not hh:xx pm
        if d_state == ON: #current_hour in cfg.getItemValueFromConfig('heat_off_hours'):  # l on and not hh:xx pm

            self.state = OFF
            logger.info('..d on, in heat off hours - skipping lon heatctl')
        else:  # d off here
            logger.info('..do heatctl')
            if currentTemp >= target_temp + self.heater_sp_offset:  # if over temp immediately turn off
                self.state = OFF
                logger.info("...temp over sp - HEATER OFF")
                self.lastStateChangeMillis = current_millis
            elif self.state == ON:  # t below tsp if time is up, so check if change the state to OFF
                if current_millis - self.lastStateChangeMillis >= self.heatOnMs:
                    self.state = OFF
                    logger.info("...in heat auto cycle - switch HEATER OFF after pulse on")
                    self.lastStateChangeMillis = current_millis
                else:
                   logger.info('in heat auto cycle - Heater still on - during low temp heat pulse')
            elif current_millis - self.lastStateChangeMillis >= self.heatOffMs:  # heater is off, turn on after delta
                self.state = ON
                logger.info("...in heat auto cycle - switch HEATER ON")
                self.lastStateChangeMillis = current_millis
            else:
                logger.info("...in heat auto cycle - during heat OFF period")
        # else:
            #print("..in d-off, no heat ctl")
        logger.info('Heater state: %s' , ('OFF' if self.state else 'ON') )
        return


    def controlv2(self, currentTemp, target_temp, d_state, current_millis, outsideTemp):
        logger.info('==Heat ctl==')
        logger.debug('OTOTOTOT outside temp OTOTOTOTO : %s', outsideTemp)


        if d_state == ON: #current_hour in cfg.getItemValueFromConfig('heat_off_hours'):  # l on and not hh:xx pm
            #self.state = OFF
            logger.info('..d on, heat off - skipping lon heatctl')
            #self.lastStateChangeMillis = current_millis
            target_temp = 15
            #return
        
        # d_state OFF if here
        logger.info('..do heatctl')
        if currentTemp >= target_temp + self.heater_sp_offset:
            #turn off and leave
            self.state = OFF
            self.lastStateChangeMillis = -180000 #current_millis - 180000 # allows immediate on on next cycle if reqd
            logger.info('..d on, in heat off hours - skipping lon heatctl')
            return



        #calc new heater on t based on current temp gap from required temp sp
        #self.heatOnMs = self.heatOnMs + ((target_temp - currentTemp) * 20 * 1000)
        #add extar time
        #! look at on period based on external temp
        #extra heater time based on diff from set point per 0.1 degree diff
        internalDiffT = int( ((target_temp - currentTemp) * 10 * self.InternalTDiffMs) )
        #logger.warning('--INTERNAL DIFF extra time to add ms : %s',internalDiffT)
       
        #extra  heater time based on external temp diff
        #do if external diff is >2 deg c
        if outsideTemp is None:
            outsideTemp = 10
        externalDiffT = int( (target_temp - 2 - outsideTemp) * self.ExternalTDiffMs ) # milli secs per degree diff
        #logger.warning('--EXTERNAL DIFF tdelta on to add  ms : %s',externalDiffT)

        self.heatOnMs = cfg.getItemValueFromConfig('heatOnMs') + internalDiffT + externalDiffT#+ (float(outsideTemp)/50)
        logger.info('--     CALCULATED TOTAL delta ON  ms : %s',self.heatOnMs)

    #        self.heatOffMs = cfg.getItemValueFromConfig('heatOffMs') + internalDiffT + externalDiffT#+ (float(outsideTemp)/50)
        #self.heatOffMs = cfg.getItemValueFromConfig('heatOffMs') + internalDiffT # + externalDiffT#+ (float(outsideTemp)/50)
        self.heatOffMs = cfg.getItemValueFromConfig('heatOffMs') + (self.heatOnMs/2) 
        #logger.warning('--     CALCULATED TOTAL HEAT OFF ms  : %s',self.heatOffMs)
        #logger.warning('==HDHDHDHDHDHDDHHD Heat tdelta on: %s',self.heatOnMs)
        # below temp sp here
        # check if this is start of a heat cycle - long time passed since last state change
        if self.state == OFF:
            if (current_millis > (self.lastStateChangeMillis + self.heatOffMs)):
            # currentTemp >= target_temp + self.heater_sp_offset:  # if over temp immediately turn off
                self.state = ON
                logger.info("...temp below sp - HEATER ON")
                self.lastStateChangeMillis = current_millis
                return
        #if here must be in a current cycle
        if self.state == ON:  # t below tsp, check if has not been on for currt-last_off_time
            if current_millis > (self.lastStateChangeMillis + self.heatOnMs):
                self.state = OFF
                logger.info("...in heat auto cycle - switch HEATER OFF after pulse on")
                self.lastStateChangeMillis = current_millis
            else:
                logger.info('in heat auto cycle - Heater still on - during low temp heat pulse')

        logger.info('Heater state: %s' , ('OFF' if self.state else 'ON') )
        return
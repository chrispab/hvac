class Vent(object):

    def __init__(self):
        logger.info("creating vent")
        self.state = OFF
        self.speed_state = OFF
        self.speed_state_count = 0
        self.speed_state_trigger = 5  # trigger hi state on n counts hi
        self.prev_vent_millis = 0  # last time vent state updated
        self.vent_on_delta = cfg.getItemValueFromConfig('ventOnDelta')  # vent on time
        self.vent_off_delta = cfg.getItemValueFromConfig('ventOffDelta')  # vent off time
        self.vent_pulse_active = OFF  # settings.ventPulseActive
        self.vent_pulse_delta = 0  # ventPulseDelta
        self.vent_pulse_on_delta = cfg.getItemValueFromConfig('ventPulseOnDelta')
        self.vent_loff_sp_offset = cfg.getItemValueFromConfig('vent_loff_sp_offset')
        self.vent_lon_sp_offset = cfg.getItemValueFromConfig('vent_lon_sp_offset')
        self.ventDisableTemp = cfg.getItemValueFromConfig('ventDisableTemp')
        self.ventDisableHumi = cfg.getItemValueFromConfig('ventDisableHumi')
        self.platformName = cfg.getItemValueFromConfig('hardware')
        self.vent_override = OFF  # settings.ventOverride
        self.ventEnableHighSpeed = cfg.getItemValueFromConfig('ventEnableHighSpeed')

    def control(self, currentTemp, currentHumi, target_temp, d_state, current_millis):
        logger.info('==Vent ctl==')
        self.vent_on_delta = cfg.getItemValueFromConfig('ventOnDelta')  # vent on time
        self.vent_off_delta = cfg.getItemValueFromConfig('ventOffDelta')  # vent off time
        #self.speed_state = OFF  # lo speed
        # if (self.platformName == 'RaspberryPi2'):
        #     if (d_state == ON) and self.ventEnableHighSpeed:
        #         self.speed_state = ON  # high speed
        #     else:
        #         self.speed_state = OFF  # lo speed

        
        # loff vent/cooling
        
        #! vent off if loff - temp/humi test mod TODO fix/finalise
        if (d_state == OFF) and (currentTemp < self.ventDisableTemp) and (currentHumi < self.ventDisableHumi):
            self.state = OFF
            self.speed_state= OFF
            return

        # force hispeed if over temp and lon
        #!add some hysteresys here
        #only for upperlon control
        if (d_state==ON):
            lowerHys = target_temp - 0.1
            upperHys = target_temp + 0.2
            #maybe use a dead band?
            
            if (self.speed_state==ON):
                if (currentTemp > lowerHys):#
                    self.speed_state=ON# high speed - leave on
                else: #(currentTemp < lowerHys):
                    self.speed_state=OFF# lo speed
            else: #speedstate is OFF
                if (currentTemp < upperHys):#
                    self.speed_state=OFF# high speed - leave on
                else: #(currentTemp > upperHys):
                    self.speed_state=ON# lo speed


        # if (self.speed_state==ON) and (currentTemp < upperHys):#
        #     self.speed_state=ON# high speed - leave on



        # if (currentTemp > target_temp +0.1) and (d_state==ON):
        #     self.speed_state=ON# high speed
        # if (currentTemp < ) and (d_state==ON): #attempt at hysteresis
        #     self.speed_state=OFF# lo speed
        
            

        if ((d_state == OFF) and (currentTemp > target_temp + self.vent_loff_sp_offset)):
            self.vent_override = ON
            self.state = ON
            #self.speed_state = ON
            self.prev_vent_millis = current_millis  # retrigeer time period
            logger.info("..VENT ON Loff - HI TEMP OVERRIDE - (Re)Triggering cooling pulse")

        if ((d_state == ON) and (currentTemp > target_temp + self.vent_lon_sp_offset)):
            self.vent_override = ON
            self.state = ON
            self.prev_vent_millis = current_millis  # retrigeer time period
            logger.info("..VENT ON - HI TEMP OVERRIDE - (Re)Triggering cooling pulse")
        # temp below target, change state to OFF after pulse delay
        elif (self.vent_override == ON) and ((current_millis - self.prev_vent_millis) >= self.vent_pulse_on_delta):
            self.state = OFF
            self.vent_override = OFF
            self.prev_vent_millis = current_millis
            logger.info("..VENT OFF - temp ok, OVERRIDE - OFF")
        elif self.vent_override == ON:
            logger.info('..Vent on - override in progress')

        # periodic vent control - only execute if vent ovveride not active
        if self.vent_override == OFF:  # process periodic vent activity
            if self.state == OFF:  # if the vent is off, we must wait for the interval to expire before turning it on
                # iftime is up, so change the state to ON
                if current_millis - self.prev_vent_millis >= self.vent_off_delta:
                    self.state = ON
                    logger.warn("VVVVVVVVVVVV..VENT ON cycle period start")
                    self.prev_vent_millis = current_millis
                else:
                    logger.info('..Vent off - during cycle OFF period')
            else:
                # vent is on, we must wait for the 'on' duration to expire before
                # turning it off
                # time up, change state to OFF
                if (current_millis - self.prev_vent_millis) >= self.vent_on_delta:
                    self.state = OFF
                    logger.warn("VVVVVVVVVVVVV..VENT OFF cycle period start")
                    self.prev_vent_millis = current_millis
                else:
                    logger.info('..Vent on - during cycle ON period')
        return
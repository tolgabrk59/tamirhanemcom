/**
 * OBD-II Bluetooth Communication Library
 * Implements ELM327 protocol for OBD-II adapters
 */

export interface OBDConnectionState {
  connected: boolean;
  deviceName: string | null;
  protocol: string | null;
  voltage: number | null;
  vin: string | null;
  error: string | null;
}

export interface DTCCode {
  code: string;
  status: 'active' | 'pending' | 'permanent';
}

export interface LiveDataReading {
  pid: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

// ELM327 AT Commands
const ELM_COMMANDS = {
  RESET: 'ATZ',
  ECHO_OFF: 'ATE0',
  HEADERS_OFF: 'ATH0',
  SPACES_OFF: 'ATS0',
  AUTO_PROTOCOL: 'ATSP0',
  VOLTAGE: 'ATRV',
  DESCRIBE_PROTOCOL: 'ATDP',
  READ_VIN: '0902',
  READ_DTCS: '03',
  CLEAR_DTCS: '04',
  PENDING_DTCS: '07',
};

// Common OBD-II PIDs
export const OBD_PIDS = {
  PIDS_SUPPORTED_1: '0100',
  MONITOR_STATUS: '0101',
  FREEZE_DTC: '0102',
  FUEL_SYSTEM_STATUS: '0103',
  ENGINE_LOAD: '0104',
  COOLANT_TEMP: '0105',
  STFT_BANK1: '0106',
  LTFT_BANK1: '0107',
  STFT_BANK2: '0108',
  LTFT_BANK2: '0109',
  FUEL_PRESSURE: '010A',
  INTAKE_MAP: '010B',
  ENGINE_RPM: '010C',
  VEHICLE_SPEED: '010D',
  TIMING_ADVANCE: '010E',
  INTAKE_TEMP: '010F',
  MAF_RATE: '0110',
  THROTTLE_POS: '0111',
  O2_SENSOR_B1S1: '0114',
  O2_SENSOR_B1S2: '0118',
  FUEL_LEVEL: '012F',
  CONTROL_VOLTAGE: '0142',
};

// PID Decoders
const pidDecoders: Record<string, (data: number[]) => { value: number; unit: string }> = {
  '0104': (data) => ({ value: (data[0] * 100) / 255, unit: '%' }), // Engine Load
  '0105': (data) => ({ value: data[0] - 40, unit: '°C' }), // Coolant Temp
  '0106': (data) => ({ value: (data[0] - 128) * (100 / 128), unit: '%' }), // STFT Bank 1
  '0107': (data) => ({ value: (data[0] - 128) * (100 / 128), unit: '%' }), // LTFT Bank 1
  '0108': (data) => ({ value: (data[0] - 128) * (100 / 128), unit: '%' }), // STFT Bank 2
  '0109': (data) => ({ value: (data[0] - 128) * (100 / 128), unit: '%' }), // LTFT Bank 2
  '010B': (data) => ({ value: data[0], unit: 'kPa' }), // Intake MAP
  '010C': (data) => ({ value: ((data[0] * 256) + data[1]) / 4, unit: 'RPM' }), // Engine RPM
  '010D': (data) => ({ value: data[0], unit: 'km/h' }), // Vehicle Speed
  '010F': (data) => ({ value: data[0] - 40, unit: '°C' }), // Intake Temp
  '0110': (data) => ({ value: ((data[0] * 256) + data[1]) / 100, unit: 'g/s' }), // MAF Rate
  '0111': (data) => ({ value: (data[0] * 100) / 255, unit: '%' }), // Throttle Position
  '012F': (data) => ({ value: (data[0] * 100) / 255, unit: '%' }), // Fuel Level
  '0142': (data) => ({ value: ((data[0] * 256) + data[1]) / 1000, unit: 'V' }), // Control Voltage
};

// PID Names in Turkish
export const pidNames: Record<string, string> = {
  '0104': 'Motor Yükü',
  '0105': 'Motor Sıcaklığı',
  '0106': 'Kısa Vadeli Yakıt Düzeltme (Bank 1)',
  '0107': 'Uzun Vadeli Yakıt Düzeltme (Bank 1)',
  '0108': 'Kısa Vadeli Yakıt Düzeltme (Bank 2)',
  '0109': 'Uzun Vadeli Yakıt Düzeltme (Bank 2)',
  '010B': 'Emme Manifoldu Basıncı',
  '010C': 'Motor Devri',
  '010D': 'Araç Hızı',
  '010F': 'Emme Havası Sıcaklığı',
  '0110': 'Hava Akış Miktarı (MAF)',
  '0111': 'Gaz Kelebeği Pozisyonu',
  '012F': 'Yakıt Seviyesi',
  '0142': 'Kontrol Voltajı',
};

class OBDBluetoothService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private buffer: string = '';
  private responsePromise: { resolve: (value: string) => void; reject: (reason: string) => void } | null = null;

  // Check if Web Bluetooth is supported
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  // Connect to OBD-II adapter
  async connect(acceptAll: boolean = false): Promise<OBDConnectionState> {
    if (!this.isSupported()) {
      return {
        connected: false,
        deviceName: null,
        protocol: null,
        voltage: null,
        vin: null,
        error: 'Web Bluetooth bu tarayıcıda desteklenmiyor. Chrome veya Edge kullanın.',
      };
    }

    try {
      // Common OBD Bluetooth services
      const obdServices = [
        '0000fff0-0000-1000-8000-00805f9b34fb', // Common OBD service
        '00001101-0000-1000-8000-00805f9b34fb', // SPP (Serial Port Profile)
        '0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10/HM-16 BLE module
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Microchip BLE
      ];

      // Request Bluetooth device - use acceptAllDevices for broader compatibility
      const requestOptions: RequestDeviceOptions = acceptAll
        ? {
            acceptAllDevices: true,
            optionalServices: obdServices,
          }
        : {
            filters: [
              { namePrefix: 'OBD' },
              { namePrefix: 'ELM' },
              { namePrefix: 'OBDII' },
              { namePrefix: 'V-LINK' },
              { namePrefix: 'Vgate' },
              { namePrefix: 'iCar' },
              { namePrefix: 'Veepeak' },
              { namePrefix: 'KONNWEI' },
              { namePrefix: 'Car Scanner' },
              { namePrefix: 'BT' },
              { namePrefix: 'HC-' }, // HC-05, HC-06 modules
              { services: obdServices },
            ],
            optionalServices: obdServices,
          };

      this.device = await navigator.bluetooth.requestDevice(requestOptions);

      if (!this.device) {
        throw new Error('Cihaz seçilmedi');
      }

      // Connect to GATT server
      const server = await this.device.gatt?.connect();
      if (!server) {
        throw new Error('GATT sunucusuna bağlanılamadı');
      }

      // Get primary service
      const services = await server.getPrimaryServices();
      if (services.length === 0) {
        throw new Error('Servis bulunamadı');
      }

      // Get characteristic
      const characteristics = await services[0].getCharacteristics();
      this.characteristic = characteristics.find(
        (c) => c.properties.write && c.properties.notify
      ) || null;

      if (!this.characteristic) {
        throw new Error('Uygun karakteristik bulunamadı');
      }

      // Start notifications
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', this.handleNotification);

      // Initialize ELM327
      await this.sendCommand(ELM_COMMANDS.RESET);
      await this.delay(1000);
      await this.sendCommand(ELM_COMMANDS.ECHO_OFF);
      await this.sendCommand(ELM_COMMANDS.HEADERS_OFF);
      await this.sendCommand(ELM_COMMANDS.SPACES_OFF);
      await this.sendCommand(ELM_COMMANDS.AUTO_PROTOCOL);

      // Get device info
      const voltage = await this.sendCommand(ELM_COMMANDS.VOLTAGE);
      const protocol = await this.sendCommand(ELM_COMMANDS.DESCRIBE_PROTOCOL);

      // Try to get VIN
      let vin = null;
      try {
        const vinResponse = await this.sendCommand(ELM_COMMANDS.READ_VIN);
        vin = this.parseVIN(vinResponse);
      } catch {
        // VIN might not be available
      }

      return {
        connected: true,
        deviceName: this.device.name || 'OBD-II Adapter',
        protocol: protocol.replace('AUTO,', '').trim(),
        voltage: parseFloat(voltage) || null,
        vin,
        error: null,
      };
    } catch (error) {
      return {
        connected: false,
        deviceName: null,
        protocol: null,
        voltage: null,
        vin: null,
        error: error instanceof Error ? error.message : 'Bağlantı hatası',
      };
    }
  }

  // Disconnect from device
  async disconnect(): Promise<void> {
    if (this.characteristic) {
      try {
        await this.characteristic.stopNotifications();
        this.characteristic.removeEventListener('characteristicvaluechanged', this.handleNotification);
      } catch {
        // Ignore errors during cleanup
      }
    }

    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }

    this.device = null;
    this.characteristic = null;
    this.buffer = '';
  }

  // Read DTCs (Diagnostic Trouble Codes)
  async readDTCs(): Promise<DTCCode[]> {
    const dtcs: DTCCode[] = [];

    // Active DTCs
    try {
      const activeResponse = await this.sendCommand(ELM_COMMANDS.READ_DTCS);
      dtcs.push(...this.parseDTCs(activeResponse, 'active'));
    } catch {
      // No active DTCs
    }

    // Pending DTCs
    try {
      const pendingResponse = await this.sendCommand(ELM_COMMANDS.PENDING_DTCS);
      dtcs.push(...this.parseDTCs(pendingResponse, 'pending'));
    } catch {
      // No pending DTCs
    }

    return dtcs;
  }

  // Clear DTCs
  async clearDTCs(): Promise<boolean> {
    try {
      await this.sendCommand(ELM_COMMANDS.CLEAR_DTCS);
      return true;
    } catch {
      return false;
    }
  }

  // Read single PID
  async readPID(pid: string): Promise<LiveDataReading | null> {
    try {
      const response = await this.sendCommand(pid);
      const data = this.parseHexResponse(response);

      if (data.length === 0) {
        return null;
      }

      const pidCode = pid.substring(0, 4);
      const decoder = pidDecoders[pidCode];

      if (!decoder) {
        return null;
      }

      const { value, unit } = decoder(data);

      return {
        pid: pidCode,
        name: pidNames[pidCode] || pid,
        value,
        unit,
        timestamp: Date.now(),
      };
    } catch {
      return null;
    }
  }

  // Read multiple PIDs
  async readMultiplePIDs(pids: string[]): Promise<LiveDataReading[]> {
    const readings: LiveDataReading[] = [];

    for (const pid of pids) {
      const reading = await this.readPID(pid);
      if (reading) {
        readings.push(reading);
      }
    }

    return readings;
  }

  // Private methods
  private handleNotification = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    const decoder = new TextDecoder();
    const text = decoder.decode(value);
    this.buffer += text;

    // Check for response end
    if (this.buffer.includes('>')) {
      const response = this.buffer.split('>')[0].trim();
      this.buffer = '';

      if (this.responsePromise) {
        this.responsePromise.resolve(response);
        this.responsePromise = null;
      }
    }
  };

  private async sendCommand(command: string): Promise<string> {
    if (!this.characteristic) {
      throw new Error('Bağlı değil');
    }

    return new Promise((resolve, reject) => {
      this.responsePromise = { resolve, reject };

      const encoder = new TextEncoder();
      const data = encoder.encode(command + '\r');

      this.characteristic!.writeValue(data).catch((error) => {
        this.responsePromise = null;
        reject(error.message);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.responsePromise) {
          this.responsePromise = null;
          reject('Zaman aşımı');
        }
      }, 5000);
    });
  }

  private parseHexResponse(response: string): number[] {
    // Remove header and parse hex bytes
    const cleaned = response.replace(/[\s\r\n]/g, '').replace(/^[0-9A-F]{2}/, '');
    const bytes: number[] = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      const hex = cleaned.substring(i, i + 2);
      const num = parseInt(hex, 16);
      if (!isNaN(num)) {
        bytes.push(num);
      }
    }

    return bytes;
  }

  private parseDTCs(response: string, status: 'active' | 'pending' | 'permanent'): DTCCode[] {
    const dtcs: DTCCode[] = [];
    const cleaned = response.replace(/[\s\r\n]/g, '');

    // Remove mode byte
    const data = cleaned.substring(2);

    // Parse DTC pairs (2 bytes each)
    for (let i = 0; i < data.length; i += 4) {
      const byte1 = parseInt(data.substring(i, i + 2), 16);
      const byte2 = parseInt(data.substring(i + 2, i + 4), 16);

      if (byte1 === 0 && byte2 === 0) continue;

      const typeCode = (byte1 >> 6) & 0x03;
      const types = ['P', 'C', 'B', 'U'];
      const type = types[typeCode];

      const digit1 = (byte1 >> 4) & 0x03;
      const digit2 = byte1 & 0x0F;
      const digit3 = (byte2 >> 4) & 0x0F;
      const digit4 = byte2 & 0x0F;

      const code = `${type}${digit1}${digit2.toString(16).toUpperCase()}${digit3.toString(16).toUpperCase()}${digit4.toString(16).toUpperCase()}`;

      dtcs.push({ code, status });
    }

    return dtcs;
  }

  private parseVIN(response: string): string | null {
    try {
      const cleaned = response.replace(/[\s\r\n]/g, '');
      const data = cleaned.substring(4); // Remove mode bytes
      let vin = '';

      for (let i = 0; i < data.length; i += 2) {
        const charCode = parseInt(data.substring(i, i + 2), 16);
        if (charCode >= 32 && charCode <= 126) {
          vin += String.fromCharCode(charCode);
        }
      }

      return vin.length === 17 ? vin : null;
    } catch {
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const obdBluetooth = new OBDBluetoothService();

using System.Runtime.CompilerServices;
using shared.Abstraction;

namespace mc_host.Services.MqttService;

public class MqttService: SingletonBase<MqttService>, IMqttService
{
    public Task Start()
    {
        throw new NotImplementedException();
    }
}
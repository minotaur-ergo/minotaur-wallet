require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
repository = package['repository']
repository_url = repository.is_a?(Hash) ? repository['url'] : repository
repository_url ||= 'https://github.com/minotaur-ergo/minotaur'

Pod::Spec.new do |s|
  s.name = 'MinotaurErgoHttp'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license'] || 'GPL-3.0'
  s.homepage = repository_url
  s.author = package['author'] || 'Minotaur Wallet'
  s.source = { git: repository_url, tag: s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '14.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end

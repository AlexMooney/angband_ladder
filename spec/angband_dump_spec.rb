require_relative '../src/angband_dump'

RSpec.describe AngbandDump do
  subject { described_class }

  let!(:lines) { IO.readlines 'spec/fixtures/tiny_dump.txt' }
  let(:file_name) { 'file.txt' }

  describe 'an instance of AngbandDump' do
    before { allow(IO).to receive(:readlines).and_return(lines) }
    subject { super().new(file_name) }

    let(:read_path) { 'data/dumpstore/file.txt' }

    it 'has a file_name method' do
      expect(subject.file_name).to eq file_name
    end

    it 'reads the filename from the data/dumpstore folder' do
      expect(IO).to receive(:readlines).once.with(read_path)
      subject
    end

    it 'knows the version of the character' do
      expect(subject.version).to eq 'Angband 9.9.9'
    end

    it 'knows the class of the character' do
      expect(subject.profession).to eq 'Warrior'
    end

    it 'knows the race of the character' do
      expect(subject.race).to eq 'Human'
    end

    it 'knows the history of the character' do
      expect(subject.history).not_to be_nil
    end

    context 'the character history' do
      it 'keeps an event for each level up' do
        # rubocop:disable Style/BracesAroundHashParameters
        expect(subject.history).to contain_exactly(
          { turn: 0, depth: 0, level: 1 },
          { turn: 500, depth: 50, level: 2 },
          { turn: 700, depth: 0, level: 2 },
          { turn: 1500, depth: 100, level: 3 }
        )
        # rubocop:enable Style/BracesAroundHashParameters
      end
    end

    describe '#write!' do
      subject { super().write! }

      it 'is defined' do
        expect(subject).to be_nil
      end
    end

    context 'with an angband dump that has no history' do
      let(:lines) { super().slice(0..6) }

      it 'raises an exception' do
        expect { subject }.to raise_error('Invalid player history')
      end
    end

    context 'with an angband variant' do
      let(:lines) do
        lines = super()
        lines[0] = lines[0].sub('Angband', 'ZAngband')
        lines
      end

      it 'raises an exception' do
        expect { subject }.to raise_error('Invalid variant')
      end
    end
  end
end
